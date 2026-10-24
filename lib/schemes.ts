export interface WelfareScheme {
  id: string;
  name: string;
  nameLocal?: string;
  scope: "Central" | "State";
  state?: string;
  category: "Insurance" | "Pension" | "Health" | "Social Security";
  benefits: string;
  coverageAmount: string;
  eligibility: string[];
  documentsRequired: string[];
  applyUrl: string;
  helpline: string;
}

export const WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: "eshram",
    name: "e-Shram Card Registration",
    nameLocal: "ई-श्रम कार्ड योजना",
    scope: "Central",
    category: "Social Security",
    benefits: "Universal UAN card for gig/unorganized workers. Includes ₹2 Lakh accidental death cover & priority disaster relief.",
    coverageAmount: "₹2,00,000 Accidental Cover",
    eligibility: [
      "Age between 16 to 59 years",
      "Engaged in gig, platform, delivery, driving or daily wage work",
      "Not a member of EPFO or ESIC",
      "Not an income tax payer",
    ],
    documentsRequired: [
      "Aadhaar Number (linked with active mobile)",
      "Bank Account details (Account No. & IFSC)",
      "Valid Mobile Number",
    ],
    applyUrl: "https://eshram.gov.in/",
    helpline: "14434 (National Toll-free)",
  },
  {
    id: "pmsby",
    name: "PM Suraksha Bima Yojana (PMSBY)",
    nameLocal: "प्रधानमंत्री सुरक्षा बीमा योजना",
    scope: "Central",
    category: "Insurance",
    benefits: "Accidental death and full disability insurance coverage of ₹2 Lakh for an annual premium of only ₹20.",
    coverageAmount: "₹2,00,000",
    eligibility: [
      "Any Indian citizen aged 18 to 70 years",
      "Active savings bank account with auto-debit consent",
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Bank passbook with KYC completed",
    ],
    applyUrl: "https://www.jansuraksha.gov.in/",
    helpline: "1800-180-1111",
  },
  {
    id: "pmjjby",
    name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
    nameLocal: "प्रधानमंत्री जीवन ज्योति बीमा योजना",
    scope: "Central",
    category: "Insurance",
    benefits: "Life insurance cover of ₹2 Lakh in case of death due to any reason for an annual premium of ₹436.",
    coverageAmount: "₹2,00,000 Life Cover",
    eligibility: [
      "Aged 18 to 50 years",
      "Active savings bank account",
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Bank Account details",
    ],
    applyUrl: "https://www.jansuraksha.gov.in/",
    helpline: "1800-180-1111",
  },
  {
    id: "pmsym",
    name: "PM Shram Yogi Maan-Dhan (PM-SYM)",
    nameLocal: "प्रधानमंत्री श्रम योगी मानधन योजना",
    scope: "Central",
    category: "Pension",
    benefits: "Assured monthly pension of ₹3,000 after reaching age 60. 50% contributed by worker, 50% matched by Central Govt.",
    coverageAmount: "₹3,000 / month Pension",
    eligibility: [
      "Age between 18 and 40 years",
      "Monthly income ₹15,000 or below",
      "Unorganized / platform / gig worker",
    ],
    documentsRequired: [
      "Aadhaar Card",
      "Savings Bank Account / Jan Dhan Account with IFSC",
    ],
    applyUrl: "https://maandhan.in/",
    helpline: "1800-267-6888",
  },
  {
    id: "rajasthan_gig_act",
    name: "Rajasthan Gig Workers Welfare Board",
    nameLocal: "राजस्थान प्लेटफॉर्म आधारित गिग कर्मकार कल्याण बोर्ड",
    scope: "State",
    state: "Rajasthan",
    category: "Social Security",
    benefits: "Statutory social security fund funded by welfare cess per transaction on Zomato, Swiggy, Ola, Uber, etc. Dedicated dispute tribunal.",
    coverageAmount: "Statutory Fund & Medical Cover",
    eligibility: [
      "Operating as a delivery partner or cab/auto driver in Rajasthan",
      "Registered on any aggregator platform",
    ],
    documentsRequired: [
      "Aggregator Partner ID / App profile screenshot",
      "Aadhaar Card",
      "Bank Account details",
    ],
    applyUrl: "https://labour.rajasthan.gov.in/",
    helpline: "0141-2450781",
  },
  {
    id: "karnataka_gig_fund",
    name: "Karnataka Gig Workers Insurance Scheme",
    nameLocal: "ಕರ್ನಾಟಕ ಗಿಗ್ ಕಾರ್ಮಿಕರ ವಿಮಾ ಯೋಜನೆ",
    scope: "State",
    state: "Karnataka",
    category: "Insurance",
    benefits: "State government funded insurance: ₹2 Lakh accidental death cover + ₹2 Lakh hospital reimbursement for platform delivery/cab partners.",
    coverageAmount: "₹4,00,000 Combined Cover",
    eligibility: [
      "Active delivery partner or driver in Karnataka",
      "Registered with Zomato, Swiggy, Zepto, Blinkit, Uber, Ola, etc.",
    ],
    documentsRequired: [
      "Platform partner ID card / screenshot",
      "Karnataka driving license / local residence proof",
      "Aadhaar Card & Bank account",
    ],
    applyUrl: "https://karunadu.karnataka.gov.in/",
    helpline: "155214",
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat (PM-JAY)",
    nameLocal: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    scope: "Central",
    category: "Health",
    benefits: "Cashless secondary and tertiary health care hospitalization coverage up to ₹5 Lakh per family per year across empaneled hospitals.",
    coverageAmount: "₹5,00,000 Annual Health Cover",
    eligibility: [
      "Families identified under SECC database or state health schemes",
      "Low income unorganized / gig workers",
    ],
    documentsRequired: [
      "Aadhaar Card or Ration Card",
      "Family ID / Samagra ID (if applicable)",
    ],
    applyUrl: "https://beneficiary.nha.gov.in/",
    helpline: "14555",
  },
];
