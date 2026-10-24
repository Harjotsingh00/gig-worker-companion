export type PlatformName =
  | "Zomato"
  | "Swiggy"
  | "Blinkit"
  | "Zepto"
  | "Uber"
  | "Ola"
  | "Porter"
  | "Urban Company"
  | "Amazon Flex";

export type DisputeCategory =
  | "unfair_deactivation"
  | "false_customer_claim"
  | "gps_delay_penalty"
  | "cod_discrepancy"
  | "fare_discrepancy"
  | "damaged_order";

export interface DisputeIssue {
  id: DisputeCategory;
  title: string;
  description: string;
  defaultPoints: string[];
}

export const DISPUTE_ISSUES: Record<DisputeCategory, DisputeIssue> = {
  unfair_deactivation: {
    id: "unfair_deactivation",
    title: "Account Suspension / Sudden ID Blacklisting",
    description: "Account was deactivated abruptly without fair human review or evidence.",
    defaultPoints: [
      "I have consistently maintained good ratings and completed deliveries faithfully.",
      "The sudden suspension violates natural justice without sharing the specific reason or evidence.",
      "Requesting immediate manual review by the Partner Grievance Cell.",
    ],
  },
  false_customer_claim: {
    id: "false_customer_claim",
    title: "False Customer 'Order Not Delivered' Claim",
    description: "Customer claimed non-delivery to get a refund, penalizing the partner.",
    defaultPoints: [
      "I reached the exact drop location mapped on the app and completed the delivery.",
      "GPS timestamp and location coordinates prove I was present at the customer's doorstep.",
      "Requesting reversal of the penalty deduction and removal of negative strike.",
    ],
  },
  gps_delay_penalty: {
    id: "gps_delay_penalty",
    title: "Unjustified Late Delivery Penalty",
    description: "Penalty charged due to restaurant wait, heavy traffic, GPS drift, or torrential rain.",
    defaultPoints: [
      "The order preparation was delayed at the merchant/restaurant for over 20 minutes.",
      "Severe weather and traffic congestion were outside partner control.",
      "Requesting full waiver of the delay deduction as per fair partnership norms.",
    ],
  },
  cod_discrepancy: {
    id: "cod_discrepancy",
    title: "Cash On Delivery (COD) / Online Pay Discrepancy",
    description: "Customer paid online via merchant QR, but app deducted cash from floating balance.",
    defaultPoints: [
      "Customer paid via UPI directly to the merchant/restaurant QR or online link.",
      "App still recorded the transaction as unpaid cash in partner floating wallet.",
      "Attaching transaction screenshot to reconcile floating balance.",
    ],
  },
  fare_discrepancy: {
    id: "fare_discrepancy",
    title: "Unpaid Wait Time / Surge & Toll Discrepancy",
    description: "Excessive wait time at pickup, return trip empty miles, or unpaid toll taxes.",
    defaultPoints: [
      "Waited more than 25 minutes at the pickup spot without mandated wait-time compensation.",
      "Toll charges paid out of pocket were not reimbursed in the final trip fare.",
      "Requesting trip fare audit and reimbursement of unpaid dues.",
    ],
  },
  damaged_order: {
    id: "damaged_order",
    title: "Customer Damaged Order / Leakage Chargeback",
    description: "Merchant packaging was leaking before pickup or damaged by customer.",
    defaultPoints: [
      "The merchant handed over packaging that was improperly sealed/leaking.",
      "I flagged the issue in the app prior to dispatch.",
      "The partner should not bear the cost of merchant packaging defect.",
    ],
  },
};

export const PLATFORM_DIRECTORY: Record<PlatformName, { email: string; phone: string; portal: string }> = {
  Zomato: {
    email: "rider-support@zomato.com",
    phone: "1800-120-1111",
    portal: "Zomato Partner App > Support > Tickets",
  },
  Swiggy: {
    email: "deliverypartners@swiggy.in",
    phone: "080-60006600",
    portal: "Swiggy Delivery App > Help Center > Grievance",
  },
  Blinkit: {
    email: "partner-support@blinkit.com",
    phone: "0124-4190800",
    portal: "Blinkit Rider App > Help",
  },
  Zepto: {
    email: "ridersupport@zeptonow.com",
    phone: "022-69822200",
    portal: "Zepto Partner App > Support",
  },
  Uber: {
    email: "support@uber.com",
    phone: "080-3535-3535",
    portal: "Uber Driver App > Help > Account & Trips",
  },
  Ola: {
    email: "partnercare@olacabs.com",
    phone: "080-67350900",
    portal: "Ola Driver App > Partner Care",
  },
  Porter: {
    email: "help@porter.in",
    phone: "022-44104410",
    portal: "Porter Partner App > Support",
  },
  "Urban Company": {
    email: "grievanceofficer@urbancompany.com",
    phone: "0124-4570250",
    portal: "UC Partner App > Help Center",
  },
  "Amazon Flex": {
    email: "amazonflex-support@amazon.in",
    phone: "1800-3000-9009",
    portal: "Amazon Flex App > Help > Contact Us",
  },
};

export interface AppealData {
  platform: PlatformName;
  issue: DisputeCategory;
  workerName: string;
  partnerId: string;
  orderOrTripId: string;
  incidentDate: string;
  details: string;
  amountDeducted?: string;
  language: "English" | "Hindi" | "Punjabi";
}

export function generateAppealDraft(data: AppealData): { subject: string; body: string; recipient: string } {
  const issueObj = DISPUTE_ISSUES[data.issue];
  const platformInfo = PLATFORM_DIRECTORY[data.platform];
  const dateStr = data.incidentDate || "recent shift";
  const deductedStr = data.amountDeducted ? ` of ₹${data.amountDeducted}` : "";

  if (data.language === "Hindi") {
    return {
      recipient: platformInfo.email,
      subject: `शिकायत एवं अपील: पार्टनर आईडी ${data.partnerId || "[पार्टनर आईडी]"} - ${issueObj.title} (ऑर्डर/ट्रिप: ${data.orderOrTripId || "हालिया"})`,
      body: `सेवा में,\nशिकायत निवारण अधिकारी (Grievance Officer),\n${data.platform} पार्टनर सपोर्ट टीम,\n\nविषय: ${issueObj.title} के संदर्भ में अपील - पार्टनर आईडी: ${data.partnerId || "[पार्टनर आईडी]"}\n\nमहोदय/महोदया,\n\nमेरा नाम ${data.workerName || "[आपका नाम]"} है और मैं ${data.platform} के साथ एक पंजीकृत पार्टनर (पार्टनर आईडी: ${data.partnerId || "[पार्टनर आईडी]"}) के रूप में कार्य कर रहा हूँ।\n\nदिनांक ${dateStr} को, ऑर्डर/ट्रिप आईडी ${data.orderOrTripId || "[ऑर्डर आईडी]"} के संबंध में मुझे अनुचित परेशानी/कटौती${deductedStr} का सामना करना पड़ा है।\n\nसमस्या का विवरण:\n${data.details || issueObj.description}\n\nमुख्य तथ्य:\n${issueObj.defaultPoints.map((point, idx) => `${idx + 1}. ${point}`).join("\n")}\n\nअतः आपसे सविनय निवेदन है कि इस मामले की मानवीय जांच (manual review) करें और अनुचित कटौती को तुरंत वापस करते हुए मेरी आईडी को पूर्ण रूप से सक्रिय रखें।\n\nसधन्यवाद,\n${data.workerName || "[आपका नाम]"}\nपार्टनर आईडी: ${data.partnerId || "[पार्टनर आईडी]"}\nमोबाइल: [आपका पंजीकृत मोबाइल नंबर]\nतारीख: ${new Date().toLocaleDateString("hi-IN")}`,
    };
  }

  if (data.language === "Punjabi") {
    return {
      recipient: platformInfo.email,
      subject: `ਸ਼ਿਕਾਇਤ ਅਤੇ ਅਪੀਲ: ਪਾਰਟਨਰ ਆਈਡੀ ${data.partnerId || "[ਪਾਰਟਨਰ ਆਈਡੀ]"} - ${issueObj.title} (ਆਰਡਰ/ਟ੍ਰਿਪ: ${data.orderOrTripId || "ਹਾਲ ਹੀ ਵਿੱਚ"})`,
      body: `ਸੇਵਾ ਵਿਖੇ,\nਸ਼ਿਕਾਇਤ ਨਿਵਾਰਨ ਅਧਿਕਾਰੀ,\n${data.platform} ਪਾਰਟਨਰ ਸਹਾਇਤਾ,\n\nਵਿਸ਼ਾ: ${issueObj.title} ਦੇ ਸੰਬੰਧ ਵਿੱਚ ਅਪੀਲ - ਪਾਰਟਨਰ ਆਈਡੀ: ${data.partnerId || "[ਪਾਰਟਨਰ ਆਈਡੀ]"}\n\nਸਤਿਕਾਰਯੋਗ ਸਰ/ਮੈਡਮ,\n\nਮੇਰਾ ਨਾਮ ${data.workerName || "[ਤੁਹਾਡਾ ਨਾਮ]"} ਹੈ ਅਤੇ ਮੈਂ ${data.platform} ਨਾਲ ਇੱਕ ਰਜਿਸਟਰਡ ਪਾਰਟਨਰ ਹਾਂ (ਆਈਡੀ: ${data.partnerId || "[ਪਾਰਟਨਰ ਆਈਡੀ]"})।\n\nਮਿਤੀ ${dateStr} ਨੂੰ ਆਰਡਰ/ਟ੍ਰਿਪ ${data.orderOrTripId || "[ਆਰਡਰ ਆਈਡੀ]"} ਸੰਬੰਧੀ ਮੇਰੇ ਨਾਲ ਅਣਉਚਿਤ ਕਟੌਤੀ${deductedStr} ਜਾਂ ਕਾਰਵਾਈ ਕੀਤੀ ਗਈ ਹੈ।\n\nਵੇਰਵਾ:\n${data.details || issueObj.description}\n\nਮੁੱਖ ਨੁਕਤੇ:\n${issueObj.defaultPoints.map((point, idx) => `${idx + 1}. ${point}`).join("\n")}\n\nਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮਾਮਲੇ ਦੀ ਨਿਰਪੱਖ ਜਾਂਚ ਕਰਕੇ ਗਲਤ ਕਟੌਤੀ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇ।\n\nਧੰਨਵਾਦ ਸਹਿਤ,\n${data.workerName || "[ਤੁਹਾਡਾ ਨਾਮ]"}\nਪਾਰਟਨਰ ਆਈਡੀ: ${data.partnerId || "[ਪਾਰਟਨਰ ਆਈਡੀ]"}\nਮਿਤੀ: ${new Date().toLocaleDateString("pa-IN")}`,
    };
  }

  return {
    recipient: platformInfo.email,
    subject: `FORMAL APPEAL & GRIEVANCE: Partner ID ${data.partnerId || "[Partner ID]"} - ${issueObj.title} (Ref: ${data.orderOrTripId || "Recent Incident"})`,
    body: `To,\nThe Grievance Redressal Officer / Partner Support,\n${data.platform} India,\n\nSubject: Formal Appeal against ${issueObj.title} | Partner ID: ${data.partnerId || "[Partner ID]"}\n\nDear Grievance Officer,\n\nI am writing to formally appeal regarding an unfair action/deduction${deductedStr} on my delivery/driver partner account (Partner ID: ${data.partnerId || "[Partner ID]"}) occurring on ${dateStr} (Ref: ${data.orderOrTripId || "[Order/Trip ID]"}).\n\nIncident Details:\n${data.details || issueObj.description}\n\nFactual Grounds for Appeal:\n${issueObj.defaultPoints.map((point, idx) => `${idx + 1}. ${point}`).join("\n")}\n\nUnder fair labor engagement and platform partner guidelines, I request an immediate manual human audit of the GPS telematics, merchant dispatch logs, and communication records for this incident. Kindly reverse the arbitrary penalty and reinstate clean standing for my account.\n\nThank you for your prompt intervention.\n\nSincerely,\n${data.workerName || "[Your Name]"}\nRegistered Partner ID: ${data.partnerId || "[Partner ID]"}\nRegistered Contact: [Your Phone Number]\nDate: ${new Date().toLocaleDateString("en-IN")}`,
  };
}
