import requests
import sys
import json
from datetime import datetime

class SiteContentTester:
    def __init__(self, base_url="https://martial-defense-app.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            request_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            request_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json() if response.content else {}
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON response)")
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test login with admin credentials"""
        login_data = {
            "email": "ajl.wkmo.ipc@gmail.com",
            "password": "Admin2025!"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_get_public_site_content(self):
        """Test getting public site content (no auth required)"""
        success, response = self.run_test(
            "Get Public Site Content",
            "GET",
            "site-content",
            200
        )
        
        if success:
            # Verify required sections exist
            required_sections = ['hero', 'about', 'contact', 'footer']
            missing_sections = [section for section in required_sections if section not in response]
            if missing_sections:
                self.log_test("Site Content Structure Validation", False, f"Missing sections: {missing_sections}")
                return False, response
            else:
                self.log_test("Site Content Structure Validation", True, "All required sections present")
                
                # Check hero section specifically
                hero = response.get('hero', {})
                hero_fields = ['title', 'subtitle', 'description']
                missing_hero_fields = [field for field in hero_fields if not hero.get(field)]
                if missing_hero_fields:
                    self.log_test("Hero Section Validation", False, f"Missing hero fields: {missing_hero_fields}")
                else:
                    self.log_test("Hero Section Validation", True, f"Hero title: '{hero.get('title', '')[:50]}...'")
        
        return success, response

    def test_get_admin_site_content(self):
        """Test getting site content for admin editing"""
        success, response = self.run_test(
            "Get Admin Site Content",
            "GET",
            "admin/site-content",
            200
        )
        return success, response

    def test_update_site_content(self):
        """Test updating site content"""
        # First get current content
        success, current_content = self.test_get_admin_site_content()
        if not success:
            return False
        
        # Update hero section with test data
        updated_content = current_content.copy()
        test_subtitle = f'Test subtitle updated by API test - {datetime.now().strftime("%H:%M:%S")}'
        updated_content['hero'] = {
            **updated_content.get('hero', {}),
            'subtitle': test_subtitle,
            'description': 'This is a test description updated via API for CMS testing'
        }
        
        success, response = self.run_test(
            "Update Site Content",
            "PUT",
            "admin/site-content",
            200,
            data=updated_content
        )
        
        if success:
            # Verify the update by getting public content
            success_verify, public_content = self.run_test(
                "Verify Content Update",
                "GET",
                "site-content",
                200
            )
            
            if success_verify:
                new_subtitle = public_content.get('hero', {}).get('subtitle', '')
                if test_subtitle in new_subtitle:
                    self.log_test("Content Update Verification", True, f"Subtitle successfully updated")
                    return True
                else:
                    self.log_test("Content Update Verification", False, f"Subtitle not updated correctly")
        
        return success

    def test_update_site_section(self):
        """Test updating a specific site section"""
        test_footer_data = {
            'tagline': f'Test tagline updated at {datetime.now().strftime("%H:%M:%S")}',
            'copyright': '© 2025 Académie Jacques Levinet - Test Update'
        }
        
        success, response = self.run_test(
            "Update Site Section (Footer)",
            "PUT",
            "admin/site-content/footer",
            200,
            data=test_footer_data
        )
        
        if success:
            # Verify the section update
            success_verify, public_content = self.run_test(
                "Verify Section Update",
                "GET",
                "site-content",
                200
            )
            
            if success_verify:
                footer = public_content.get('footer', {})
                if test_footer_data['tagline'] in footer.get('tagline', ''):
                    self.log_test("Section Update Verification", True, "Footer section updated successfully")
                    return True
                else:
                    self.log_test("Section Update Verification", False, "Footer section not updated correctly")
        
        return success

    def test_complete_cms_workflow(self):
        """Test complete CMS workflow: Admin modifies content -> Verify on public page"""
        print("\n🔄 Testing Complete CMS Workflow...")
        
        # Step 1: Get baseline public content
        success, original_content = self.test_get_public_site_content()
        if not success:
            return False
        
        original_hero_subtitle = original_content.get('hero', {}).get('subtitle', '')
        
        # Step 2: Admin gets content for editing
        success, admin_content = self.test_get_admin_site_content()
        if not success:
            return False
        
        # Step 3: Admin modifies content
        workflow_test_subtitle = f'CMS Workflow Test - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
        admin_content['hero']['subtitle'] = workflow_test_subtitle
        admin_content['hero']['description'] = 'This content was modified through the CMS workflow test to verify the complete integration between admin editing and public display.'
        
        success, _ = self.run_test(
            "CMS Workflow: Admin Update",
            "PUT",
            "admin/site-content",
            200,
            data=admin_content
        )
        if not success:
            return False
        
        # Step 4: Verify changes appear on public endpoint
        success, updated_public = self.run_test(
            "CMS Workflow: Public Verification",
            "GET",
            "site-content",
            200
        )
        
        if success:
            new_subtitle = updated_public.get('hero', {}).get('subtitle', '')
            new_description = updated_public.get('hero', {}).get('description', '')
            
            if workflow_test_subtitle == new_subtitle:
                self.log_test("CMS Workflow Complete", True, f"✅ Content successfully flows from admin edit to public display")
                return True
            else:
                self.log_test("CMS Workflow Complete", False, f"❌ Content not properly updated. Expected: '{workflow_test_subtitle}', Got: '{new_subtitle}'")
                return False
        
        return False

    def run_all_tests(self):
        """Run all site content CMS tests"""
        print("🚀 Starting Site Content CMS Tests")
        print("=" * 60)
        
        # Test authentication first
        print("\n📋 AUTHENTICATION")
        print("-" * 30)
        
        if not self.test_admin_login():
            print("❌ Admin login failed. Cannot proceed with admin tests.")
            return False
        
        # Test public endpoint (no auth required)
        print("\n📋 PUBLIC SITE CONTENT API")
        print("-" * 30)
        
        success, public_content = self.test_get_public_site_content()
        if not success:
            print("❌ Public site content API failed")
            return False
        
        # Test admin endpoints (auth required)
        print("\n📋 ADMIN SITE CONTENT API")
        print("-" * 30)
        
        success, admin_content = self.test_get_admin_site_content()
        if not success:
            print("❌ Admin site content API failed")
            return False
        
        # Test content updates
        print("\n📋 CONTENT UPDATE TESTS")
        print("-" * 30)
        
        self.test_update_site_content()
        self.test_update_site_section()
        
        # Test complete workflow
        print("\n📋 COMPLETE CMS WORKFLOW")
        print("-" * 30)
        
        self.test_complete_cms_workflow()
        
        return True

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 SITE CONTENT CMS TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_run - self.tests_passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   - {result['test_name']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SiteContentTester()
    
    try:
        success = tester.run_all_tests()
        tester.print_summary()
        
        # Save detailed results
        with open('/app/test_reports/site_content_test_results.json', 'w') as f:
            json.dump({
                'summary': {
                    'total_tests': tester.tests_run,
                    'passed_tests': tester.tests_passed,
                    'failed_tests': tester.tests_run - tester.tests_passed,
                    'success_rate': (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0
                },
                'detailed_results': tester.test_results,
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"❌ Critical error during testing: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())