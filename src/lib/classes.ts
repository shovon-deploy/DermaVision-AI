export type Group = "benign" | "malignant" | "pre-malignant";

export const GROUP_STYLE: Record<Group, string> = {
  benign: "border-emerald-300 bg-emerald-100 text-emerald-900",
  malignant: "border-red-300 bg-red-100 text-red-900",
  "pre-malignant": "border-amber-300 bg-amber-100 text-amber-900",
};

export const CLASS_INFO: Record<string, { name: string; group: Group; about: string }> = {
  akiec: {
    name: "Actinic keratoses / intraepithelial carcinoma",
    group: "pre-malignant",
    about:
      "Rough, scaly patches caused by long-term sun exposure. They can be pre-cancerous, and the intraepithelial carcinoma form (Bowen's disease) is an early, non-invasive squamous cell cancer.",
  },
  bcc: {
    name: "Basal cell carcinoma",
    group: "malignant",
    about:
      "The most common skin cancer. It grows slowly and rarely spreads, but it can damage the surrounding tissue if it is not treated.",
  },
  bkl: {
    name: "Benign keratosis-like lesions",
    group: "benign",
    about:
      "A group that includes seborrheic keratoses, solar lentigines and lichen-planus-like keratoses. They are harmless but can look like melanoma.",
  },
  df: {
    name: "Dermatofibroma",
    group: "benign",
    about: "A common, harmless firm bump in the skin, most often found on the legs.",
  },
  mel: {
    name: "Melanoma",
    group: "malignant",
    about:
      "The most dangerous skin cancer. It starts in pigment cells and can spread early, so finding it early matters most.",
  },
  nv: {
    name: "Melanocytic nevi",
    group: "benign",
    about: "Ordinary moles. Most are harmless, but a mole that changes should be checked by a doctor.",
  },
  vasc: {
    name: "Vascular lesions",
    group: "benign",
    about: "Benign lesions made of blood vessels, such as angiomas, angiokeratomas and pyogenic granulomas.",
  },
};
