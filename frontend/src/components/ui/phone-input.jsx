import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Composant PhoneInput pour le formatage international des numéros de téléphone
 * Format: +33 6 12 34 56 78 (ou autre indicatif pays)
 */
const PhoneInput = React.forwardRef(({ className, value, onChange, countryCode = "FR", ...props }, ref) => {
  // Indicatifs téléphoniques par pays
  const countryPrefixes = {
    FR: "+33",
    BE: "+32",
    CH: "+41",
    LU: "+352",
    MC: "+377",
    CA: "+1",
    US: "+1",
    GB: "+44",
    DE: "+49",
    ES: "+34",
    IT: "+39",
    PT: "+351",
    NL: "+31",
    MA: "+212",
    TN: "+216",
    DZ: "+213",
    SN: "+221",
    CI: "+225",
    CM: "+237",
    MG: "+261",
    MU: "+230",
    RE: "+262",
    GP: "+590",
    MQ: "+596",
    GF: "+594",
    NC: "+687",
    PF: "+689",
  };

  const prefix = countryPrefixes[countryCode] || "+33";

  // Formater le numéro de téléphone
  const formatPhoneNumber = (input) => {
    if (!input) return "";
    
    // Nettoyer le numéro (garder uniquement les chiffres et le +)
    let cleaned = input.replace(/[^\d+]/g, "");
    
    // Si le numéro commence par 0, le remplacer par l'indicatif pays
    if (cleaned.startsWith("0") && cleaned.length > 1) {
      cleaned = prefix + cleaned.substring(1);
    }
    
    // Si le numéro ne commence pas par +, ajouter l'indicatif
    if (!cleaned.startsWith("+") && cleaned.length > 0) {
      cleaned = prefix + cleaned;
    }
    
    // Formater avec des espaces (format français: +33 6 12 34 56 78)
    if (cleaned.startsWith("+33")) {
      const afterPrefix = cleaned.substring(3);
      let formatted = "+33";
      for (let i = 0; i < afterPrefix.length && i < 9; i++) {
        if (i % 2 === 0) formatted += " ";
        formatted += afterPrefix[i];
      }
      return formatted.trim();
    }
    
    // Format générique pour autres pays
    return cleaned;
  };

  const handleChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    // Créer un événement synthétique avec la valeur formatée
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted
      }
    };
    onChange?.(syntheticEvent);
  };

  return (
    <input
      type="tel"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      value={value}
      onChange={handleChange}
      placeholder={`${prefix} 6 12 34 56 78`}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
