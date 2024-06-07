import { useState } from "react";
import Autocomplete from "./Autocomplete";

const initialData: Record<string, any> = {
  businessInformation: {
    mccCodeAliasId: "",
    detailedExplanationWhatDoYouSell: "",
    merchantType: "additionalLocation",
    dbaName: "",
    legalName: "",
    website: "",
    businessPhone: "",
    customerServicePhone: "",
    businessEmail: "",
    isMerchantOptsOutReceivingFutureCommercialFromAmex: false,
    typeOfBusiness: "limitedLiability",
    businessEstablishedDate: "",
    taxId: "",
    documentationMailingAddress: "dbaAddress",
    swiped: 0,
    keyed: 0,
    "e-commerce": 100,
    desiredLimits: {
      monthlyVMcD: 0,
      avgTicketVMcD: 0,
      highTicketVMcD: 0,
      monthlyAmex: 0,
      avgTicketAmex: 0,
      highTicketAmex: 0,
    },
    sellingOutsideOfUs: false,
    siteInspectionType: "aurora",
    bankInfo: {
      routing: "",
      bank: "",
      account: "",
      accountName: "",
    },
  },
  locationAddress: {
    typeOfLocation: "office",
    locationIfOther: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    regionCode: "",
    postalCode: "",
    countryCode: "",
  },
  isLegalAddressTheSame: true,
  legalAddress: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    regionCode: "",
    postalCode: "",
    countryCode: "",
  },
  owner1: {
    ownership: 0,
    firstName: "",
    lastName: "",
    title: "",
    phoneNumber: "",
    email: "",
    ssn: "",
    dateOfBirth: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      regionCode: "",
      postalCode: "",
      countryCode: "",
    },
  },
  authorizedSigner: {
    firstName: "",
    lastName: "",
    title: "",
    phoneNumber: "",
    email: "",
    ssn: "",
    dateOfBirth: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      regionCode: "",
      postalCode: "",
      countryCode: "",
    },
  },
  isPrimaryContactTheSame: true,
  primaryContact: {
    firstName: "",
    lastName: "",
    title: "",
    phoneNumber: "",
    email: "",
  },
  achProcessor: "achq",
  achProcessorData: {
    monthlyVolumeAch: 0,
    monthlyVolumeAchPayouts: 0,
    highTicketAch: 0,
    highTicketAchPayouts: 0,
    ticketCountAch: 0,
    ticketCountAchPayouts: 0,
    customerType: "both",
    paymentAuthorizationType: "both",
    statementDescriptor: "",
    useOfPaymentServiceDescription: "",
    billingRouting: "",
    billingBank: "",
    billingAccount: "",
    billingAccountName: "",
  },
};
const businessTypes: Record<string, string> = {
  soleProprietor: "Sole Proprietor",
  limitedLiability: "Limited Liability",
  partnership: "Partnership",
  trustEstate: "Trust Estate",
  publicCorporation: "Public Corporation",
  privateCorporation: "Private Corporation",
  taxExempt: "Tax Exempt",
  government: "Government",
  other: "Other",
};
const locationTypes: Record<string, string> = {
  home: "Home",
  storeFront: "Store Front",
  apartment: "Apartment",
  office: "Office",
  other: "Other",
};

const Form = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const handleCheckbox = (e: any) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleNestedChange = (section: string, field: any, value: string) => {
    if (typeof field === "object") {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field.name]: {
            ...prevData[section][field.name],
            [field.subField]: value,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    }
  };

  const handleMultipleNestedChanges = (section: any, updates: any) => {
    setFormData((prevData) => {
      const newSectionData = { ...prevData[section] };
      updates.forEach(({ field, value }: any) => {
        if (typeof field === "object") {
          newSectionData[field.name] = {
            ...newSectionData[field.name],
            [field.subField]: value,
          };
        } else {
          newSectionData[field] = value;
        }
      });
      return {
        ...prevData,
        [section]: newSectionData,
      };
    });
  };

  const handleOwnerChange = (ownerKey: string, field: any, value: any) => {
    setFormData((prevData) => {
      if (typeof field === "object") {
        return {
          ...prevData,
          [ownerKey]: {
            ...prevData[ownerKey],
            [field.name]: {
              ...prevData[ownerKey][field.name],
              [field.subField]: value,
            },
          },
        };
      }
      return {
        ...prevData,
        [ownerKey]: {
          ...prevData[ownerKey],
          [field]: value,
        },
      };
    });
  };

  const addOwner = () => {
    const ownerKeys = ["owner1", "owner2", "owner3", "owner4"];
    for (let i = 1; i < ownerKeys.length; i++) {
      const key = ownerKeys[i];
      if (formData[key] === undefined) {
        setFormData((prevData) => ({
          ...prevData,
          [key]: { ...initialData.owner1 },
        }));
        break;
      }
    }
  };

  const fetchCityAndState = async (
    zip: string,
    callback: (city: string, state: string) => void
  ) => {
    try {
      if (zip.length === 5) {
        const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
        const data = await response.json();
        const place = data.places[0];
        callback(place["place name"], place["state abbreviation"]);
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    (async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/createDraft`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((ok) => ok.json());
      console.log(response);
    })();
  };

  return (
    <div className="max-w-full mx-auto bg-white p-6 shadow-lg rounded-md">
      <form onSubmit={handleSubmit}>
        {currentStep === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Business Information</h2>
            <div className="mb-4">
              <label htmlFor="businessType" className="block text-gray-700">
                Business Type
              </label>
              <select
                id="businessType"
                value={formData.businessInformation.typeOfBusiness}
                onChange={(e) =>
                  handleNestedChange(
                    "businessInformation",
                    "typeOfBusiness",
                    e.target.value
                  )
                }
                className="mt-1 block w-md px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                {Object.keys(businessTypes).map((key) => (
                  <option key={key} value={key}>
                    {businessTypes[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor="legalName" className="block text-gray-700">
                  Legal Business Name
                </label>
                <input
                  type="text"
                  id="legalName"
                  name="legalName"
                  value={formData.businessInformation.legalName}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "legalName",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dbaName" className="block text-gray-700">
                  DBA Name
                </label>
                <input
                  type="text"
                  id="dbaName"
                  name="dbaName"
                  value={formData.businessInformation.dbaName}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "dbaName",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.businessInformation.businessEmail}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "businessEmail",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="businessPhone" className="block text-gray-700">
                  Business Phone
                </label>
                <input
                  type="text"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessInformation.businessPhone}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "businessPhone",
                      // e.target.value
                      "+1" + e.target.value.replace(/^\+1/, "")
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="taxId" className="block text-gray-700">
                  Business EIN
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.businessInformation.taxId}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "taxId",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="businessEstablishedDate"
                  className="block text-gray-700"
                >
                  Established Date
                </label>
                <input
                  type="date"
                  id="businessEstablishedDate"
                  name="businessEstablishedDate"
                  value={formData.businessInformation.businessEstablishedDate.slice(
                    0,
                    10
                  )}
                  onChange={(e) => {
                    const date = new Date(e.target.value).toISOString();
                    handleNestedChange(
                      "businessInformation",
                      "businessEstablishedDate",
                      date
                    );
                  }}
                  className="mt-1 block w-sm px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <Autocomplete
              label="MCC Alias Search"
              value={formData.businessInformation.mccCodeAliasId}
              onChange={(value: string) =>
                handleNestedChange(
                  "businessInformation",
                  "mccCodeAliasId",
                  value
                )
              }
            />
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor="website" className="block text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.businessInformation.website}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "website",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="customerServicePhone"
                  className="block text-gray-700"
                >
                  Customer Service Phone
                </label>
                <input
                  type="text"
                  id="customerServicePhone"
                  name="customerServicePhone"
                  value={formData.businessInformation.customerServicePhone}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      "customerServicePhone",
                      "+1" + e.target.value.replace(/^\+1/, "")
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="detailedExplanationWhatDoYouSell"
                className="block text-gray-700"
              >
                Detailed Description Of What You Sell
              </label>
              <textarea
                id="detailedExplanationWhatDoYouSell"
                name="detailedExplanationWhatDoYouSell"
                value={
                  formData.businessInformation.detailedExplanationWhatDoYouSell
                }
                onChange={(e) =>
                  handleNestedChange(
                    "businessInformation",
                    "detailedExplanationWhatDoYouSell",
                    e.target.value
                  )
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <h2 className="text-xl font-bold mt-8 mb-4">Bank Information</h2>
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor="bank" className="block text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bank"
                  name="bank"
                  value={formData.businessInformation.bankInfo.bank}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "bankInfo", subField: "bank" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="accountName" className="block text-gray-700">
                  Account Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={formData.businessInformation.bankInfo.accountName}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "bankInfo", subField: "accountName" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="routing" className="block text-gray-700">
                  Bank Routing
                </label>
                <input
                  type="text"
                  id="routing"
                  name="routing"
                  value={formData.businessInformation.bankInfo.routing}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "bankInfo", subField: "routing" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="account" className="block text-gray-700">
                  Account Number
                </label>
                <input
                  type="text"
                  id="account"
                  name="account"
                  value={formData.businessInformation.bankInfo.account}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "bankInfo", subField: "account" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <h3 className="text-md font-bold mt-8 mb-4">
              Visa/Master Card/Discover
            </h3>
            <div className="lg:columns-3">
              <div className="mb-4">
                <label htmlFor="avgTicketVMcD" className="block text-gray-700">
                  Average Transaction
                </label>
                <input
                  type="text"
                  id="avgTicketVMcD"
                  name="avgTicketVMcD"
                  value={
                    formData.businessInformation.desiredLimits.avgTicketVMcD
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "avgTicketVMcD" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="monthlyVMcD" className="block text-gray-700">
                  Monthly Gross
                </label>
                <input
                  type="text"
                  id="monthlyVMcD"
                  name="monthlyVMcD"
                  value={formData.businessInformation.desiredLimits.monthlyVMcD}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "monthlyVMcD" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="highTicketVMcD" className="block text-gray-700">
                  Highest Limit
                </label>
                <input
                  type="text"
                  id="highTicketVMcD"
                  name="highTicketVMcD"
                  value={
                    formData.businessInformation.desiredLimits.highTicketVMcD
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "highTicketVMcD" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <h3 className="text-md font-bold mt-8 mb-4">American Express</h3>
            <div className="lg:columns-3">
              <div className="mb-4">
                <label htmlFor="avgTicketAmex" className="block text-gray-700">
                  Average Transaction
                </label>
                <input
                  type="text"
                  id="avgTicketAmex"
                  name="avgTicketAmex"
                  value={
                    formData.businessInformation.desiredLimits.avgTicketAmex
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "avgTicketAmex" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="monthlyAmex" className="block text-gray-700">
                  Monthly Gross
                </label>
                <input
                  type="text"
                  id="monthlyAmex"
                  name="monthlyAmex"
                  value={formData.businessInformation.desiredLimits.monthlyAmex}
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "monthlyAmex" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="highTicketAmex" className="block text-gray-700">
                  Highest Limit
                </label>
                <input
                  type="text"
                  id="highTicketAmex"
                  name="highTicketAmex"
                  value={
                    formData.businessInformation.desiredLimits.highTicketAmex
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "businessInformation",
                      { name: "desiredLimits", subField: "highTicketAmex" },
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Location Address</h2>
            <div className="mb-4">
              <label htmlFor="typeOfLocation" className="block text-gray-700">
                Location Type
              </label>
              <select
                id="typeOfLocation"
                value={formData.locationAddress.typeOfLocation}
                onChange={(e) =>
                  handleNestedChange(
                    "locationAddress",
                    "typeOfLocation",
                    e.target.value
                  )
                }
                className="mt-1 block w-md px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                {Object.keys(locationTypes).map((key) => (
                  <option key={key} value={key}>
                    {locationTypes[key]}
                  </option>
                ))}
              </select>
            </div>
            {formData.locationAddress.typeOfLocation === "other" && (
              <div className="mb-4">
                <label
                  htmlFor="locationIfOther"
                  className="block text-gray-700"
                >
                  Other Location
                </label>
                <input
                  type="text"
                  id="locationIfOther"
                  name="locationIfOther"
                  value={formData.locationAddress.locationIfOther}
                  onChange={(e) =>
                    handleNestedChange(
                      "locationAddress",
                      "locationIfOther",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor="addressLine1" className="block text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.locationAddress.addressLine1}
                  onChange={(e) => {
                    handleNestedChange(
                      "locationAddress",
                      "addressLine1",
                      e.target.value
                    );
                    handleNestedChange(
                      "legalAddress",
                      "addressLine1",
                      e.target.value
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="addressLine2" className="block text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.locationAddress.addressLine2}
                  onChange={(e) => {
                    handleNestedChange(
                      "locationAddress",
                      "addressLine2",
                      e.target.value
                    );
                    handleNestedChange(
                      "legalAddress",
                      "addressLine2",
                      e.target.value
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="regionCode" className="block text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                id="regionCode"
                name="regionCode"
                value={formData.locationAddress.regionCode}
                onChange={(e) => {
                  const zip = e.target.value;
                  handleNestedChange("locationAddress", "regionCode", zip);
                  handleNestedChange("locationAddress", "postalCode", zip);
                  handleNestedChange("legalAddress", "regionCode", zip);
                  handleNestedChange("legalAddress", "postalCode", zip);
                  fetchCityAndState(zip, (city, state) => {
                    handleMultipleNestedChanges("locationAddress", [
                      { field: "city", value: city },
                      { field: "countryCode", value: state },
                    ]);
                    handleMultipleNestedChanges("legalAddress", [
                      { field: "city", value: city },
                      { field: "countryCode", value: state },
                    ]);
                  });
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            {/* disabled */}
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700">
                  City
                </label>
                <input
                  disabled
                  type="text"
                  id="city"
                  name="city"
                  value={formData.locationAddress.city}
                  onChange={(e) =>
                    handleNestedChange(
                      "locationAddress",
                      "city",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="countryCode" className="block text-gray-700">
                  State
                </label>
                <input
                  disabled
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  value={formData.locationAddress.countryCode}
                  onChange={(e) =>
                    handleNestedChange(
                      "locationAddress",
                      "countryCode",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isLegalAddressTheSame"
                name="isLegalAddressTheSame"
                checked={formData.isLegalAddressTheSame}
                onChange={handleCheckbox}
                className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="isLegalAddressTheSame"
                className="ml-2 block text-gray-700"
              >
                Same Mailing Address
              </label>
            </div>
            {!formData.isLegalAddressTheSame && (
              <div>
                <h2 className="text-xl font-bold mt-8 mb-4">Mailing Address</h2>
                <div className="lg:columns-2">
                  <div className="mb-4">
                    <label
                      htmlFor="addressLine1"
                      className="block text-gray-700"
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.legalAddress.addressLine1}
                      onChange={(e) =>
                        handleNestedChange(
                          "legalAddress",
                          "addressLine1",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="addressLine2"
                      className="block text-gray-700"
                    >
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.legalAddress.addressLine2}
                      onChange={(e) =>
                        handleNestedChange(
                          "legalAddress",
                          "addressLine2",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="regionCode" className="block text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="regionCode"
                    name="regionCode"
                    value={formData.legalAddress.regionCode}
                    onChange={(e) => {
                      const zip = e.target.value;
                      handleNestedChange("legalAddress", "regionCode", zip);
                      handleNestedChange("legalAddress", "postalCode", zip);
                      fetchCityAndState(zip, (city, state) => {
                        handleMultipleNestedChanges("legalAddress", [
                          { field: "city", value: city },
                          { field: "countryCode", value: state },
                        ]);
                      });
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {/* disabled */}
                <div className="lg:columns-2">
                  <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700">
                      City
                    </label>
                    <input
                      disabled
                      type="text"
                      id="city"
                      name="city"
                      value={formData.legalAddress.city}
                      onChange={(e) =>
                        handleNestedChange(
                          "legalAddress",
                          "city",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="countryCode"
                      className="block text-gray-700"
                    >
                      State
                    </label>
                    <input
                      disabled
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={formData.legalAddress.countryCode}
                      onChange={(e) =>
                        handleNestedChange(
                          "legalAddress",
                          "countryCode",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Add more fields for Location Address */}
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Owner Information</h2>
            {["owner1", "owner2", "owner3", "owner4"].map(
              (ownerKey, index) =>
                formData[ownerKey] && (
                  <div key={ownerKey} className="mb-4">
                    <h3 className="text-md font-bold mt-8 mb-2">
                      Owner {index + 1}
                    </h3>
                    <div className="lg:columns-2">
                      <div className="mb-4">
                        <label
                          htmlFor={`title${index}`}
                          className="block text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id={`title${index}`}
                          name={`title${index}`}
                          value={formData[ownerKey].title}
                          onChange={(e) =>
                            handleOwnerChange(ownerKey, "title", e.target.value)
                          }
                          className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`ownership${index}`}
                          className="block text-gray-700"
                        >
                          Ownership Percentage
                        </label>
                        <input
                          type="number"
                          id={`ownership${index}`}
                          name={`ownership${index}`}
                          value={formData[ownerKey].ownership}
                          onChange={(e) =>
                            handleOwnerChange(
                              ownerKey,
                              "ownership",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="lg:columns-2">
                      <div className="mb-4">
                        <label
                          htmlFor={`firstName${index}`}
                          className="block text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id={`firstName${index}`}
                          name={`firstName${index}`}
                          value={formData[ownerKey].firstName}
                          onChange={(e) =>
                            handleOwnerChange(
                              ownerKey,
                              "firstName",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`lastName${index}`}
                          className="block text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id={`lastName${index}`}
                          name={`lastName${index}`}
                          value={formData[ownerKey].lastName}
                          onChange={(e) =>
                            handleOwnerChange(
                              ownerKey,
                              "lastName",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="lg:columns-2">
                      <div className="mb-4">
                        <label
                          htmlFor={`phoneNumber${index}`}
                          className="block text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id={`phoneNumber${index}`}
                          name={`phoneNumber${index}`}
                          value={formData[ownerKey].phoneNumber}
                          onChange={(e) =>
                            handleOwnerChange(
                              ownerKey,
                              "phoneNumber",
                              "+1" + e.target.value.replace(/^\+1/, "")
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`email${index}`}
                          className="block text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id={`email${index}`}
                          name={`email${index}`}
                          value={formData[ownerKey].email}
                          onChange={(e) =>
                            handleOwnerChange(ownerKey, "email", e.target.value)
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor={`ssn${index}`}
                        className="block text-gray-700"
                      >
                        SSN
                      </label>
                      <input
                        type="text"
                        id={`ssn${index}`}
                        name={`ssn${index}`}
                        value={formData[ownerKey].ssn}
                        onChange={(e) =>
                          handleOwnerChange(ownerKey, "ssn", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor={`dateOfBirth${index}`}
                        className="block text-gray-700"
                      >
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        id={`dateOfBirth${index}`}
                        name={`dateOfBirth${index}`}
                        value={formData[ownerKey].dateOfBirth.slice(0, 10)}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          handleOwnerChange(
                            ownerKey,
                            "dateOfBirth",
                            date.toISOString()
                          );
                        }}
                        className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    {/* Address */}
                    <div className="mb-4">
                      <div className="lg:columns-2">
                        <div className="mb-4">
                          <label
                            htmlFor={`addressLine1${index}`}
                            className="block text-gray-700"
                          >
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            id={`addressLine1${index}`}
                            name={`addressLine1${index}`}
                            value={formData[ownerKey].address.addressLine1}
                            onChange={(e) =>
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "addressLine1" },
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor={`addressLine2${index}`}
                            className="block text-gray-700"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            id={`addressLine2${index}`}
                            name={`addressLine2${index}`}
                            value={formData[ownerKey].address.addressLine2}
                            onChange={(e) =>
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "addressLine2" },
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor={`regionCode${index}`}
                          className="block text-gray-700"
                        >
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id={`regionCode${index}`}
                          name={`regionCode${index}`}
                          value={formData[ownerKey].address.regionCode}
                          onChange={(e) => {
                            const zip = e.target.value;
                            handleOwnerChange(
                              ownerKey,
                              { name: "address", subField: "regionCode" },
                              zip
                            );
                            handleOwnerChange(
                              ownerKey,
                              { name: "address", subField: "postalCode" },
                              zip
                            );
                            fetchCityAndState(zip, (city, state) => {
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "city" },
                                city
                              );
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "countryCode" },
                                state
                              );
                            });
                          }}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="lg:columns-2">
                        <div className="mb-4">
                          <label
                            htmlFor={`city${index}`}
                            className="block text-gray-700"
                          >
                            City
                          </label>
                          <input
                            disabled
                            type="text"
                            id={`city${index}`}
                            name={`city${index}`}
                            value={formData[ownerKey].address.city}
                            onChange={(e) =>
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "city" },
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor={`countryCode${index}`}
                            className="block text-gray-700"
                          >
                            Country Code
                          </label>
                          <input
                            disabled
                            type="text"
                            id={`countryCode${index}`}
                            name={`countryCode${index}`}
                            value={formData[ownerKey].address.countryCode}
                            onChange={(e) =>
                              handleOwnerChange(
                                ownerKey,
                                { name: "address", subField: "countryCode" },
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
            {!formData.owner4 && (
              <button
                type="button"
                onClick={addOwner}
                className="px-4 py-2 bg-purple-500 text-white rounded-md shadow"
              >
                Add Another Owner
              </button>
            )}
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Authorized Signer</h2>
            <div className="mb-4">
              <label htmlFor={`title`} className="block text-gray-700">
                Title
              </label>
              <input
                type="text"
                id={`title`}
                name={`title`}
                value={formData.authorizedSigner.title}
                onChange={(e) => {
                  handleNestedChange(
                    "authorizedSigner",
                    "title",
                    e.target.value
                  );
                  handleNestedChange("primaryContact", "title", e.target.value);
                }}
                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor={`firstName`} className="block text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id={`firstName`}
                  name={`firstName`}
                  value={formData.authorizedSigner.firstName}
                  onChange={(e) => {
                    handleNestedChange(
                      "authorizedSigner",
                      "firstName",
                      e.target.value
                    );
                    handleNestedChange(
                      "primaryContact",
                      "firstName",
                      e.target.value
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`lastName`} className="block text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id={`lastName`}
                  name={`lastName`}
                  value={formData.authorizedSigner.lastName}
                  onChange={(e) => {
                    handleNestedChange(
                      "authorizedSigner",
                      "lastName",
                      e.target.value
                    );
                    handleNestedChange(
                      "primaryContact",
                      "lastName",
                      e.target.value
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="lg:columns-2">
              <div className="mb-4">
                <label htmlFor={`phoneNumber`} className="block text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id={`phoneNumber`}
                  name={`phoneNumber`}
                  value={formData.authorizedSigner.phoneNumber}
                  onChange={(e) => {
                    handleNestedChange(
                      "authorizedSigner",
                      "phoneNumber",
                      "+1" + e.target.value.replace(/^\+1/, "")
                    );
                    handleNestedChange(
                      "primaryContact",
                      "phoneNumber",
                      "+1" + e.target.value.replace(/^\+1/, "")
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`email`} className="block text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id={`email`}
                  name={`email`}
                  value={formData.authorizedSigner.email}
                  onChange={(e) => {
                    handleNestedChange(
                      "authorizedSigner",
                      "email",
                      e.target.value
                    );
                    handleNestedChange(
                      "primaryContact",
                      "email",
                      e.target.value
                    );
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor={`ssn`} className="block text-gray-700">
                SSN
              </label>
              <input
                type="text"
                id={`ssn`}
                name={`ssn`}
                value={formData.authorizedSigner.ssn}
                onChange={(e) =>
                  handleNestedChange("authorizedSigner", "ssn", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor={`dateOfBirth`} className="block text-gray-700">
                Date Of Birth
              </label>
              <input
                type="date"
                id={`dateOfBirth`}
                name={`dateOfBirth`}
                value={formData.authorizedSigner.dateOfBirth.slice(0, 10)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleNestedChange(
                    "authorizedSigner",
                    "dateOfBirth",
                    date.toISOString()
                  );
                }}
                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            {/* Address */}
            <div className="mb-4">
              <div className="lg:columns-2">
                <div className="mb-4">
                  <label
                    htmlFor={`addressLine1`}
                    className="block text-gray-700"
                  >
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id={`addressLine1`}
                    name={`addressLine1`}
                    value={formData.authorizedSigner.address.addressLine1}
                    onChange={(e) =>
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "addressLine1" },
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`addressLine2`}
                    className="block text-gray-700"
                  >
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id={`addressLine2`}
                    name={`addressLine2`}
                    value={formData.authorizedSigner.address.addressLine2}
                    onChange={(e) =>
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "addressLine2" },
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor={`regionCode`} className="block text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  id={`regionCode`}
                  name={`regionCode`}
                  value={formData.authorizedSigner.address.regionCode}
                  onChange={(e) => {
                    const zip = e.target.value;
                    handleNestedChange(
                      "authorizedSigner",
                      { name: "address", subField: "regionCode" },
                      e.target.value
                    );
                    handleNestedChange(
                      "authorizedSigner",
                      { name: "address", subField: "postalCode" },
                      e.target.value
                    );
                    fetchCityAndState(zip, (city, state) => {
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "city" },
                        city
                      );
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "countryCode" },
                        state
                      );
                    });
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="lg:columns-2">
                <div className="mb-4">
                  <label htmlFor={`city`} className="block text-gray-700">
                    City
                  </label>
                  <input
                    disabled
                    type="text"
                    id={`city`}
                    name={`city`}
                    value={formData.authorizedSigner.address.city}
                    onChange={(e) =>
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "city" },
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`countryCode`}
                    className="block text-gray-700"
                  >
                    Country Code
                  </label>
                  <input
                    disabled
                    type="text"
                    id={`countryCode`}
                    name={`countryCode`}
                    value={formData.authorizedSigner.address.countryCode}
                    onChange={(e) =>
                      handleNestedChange(
                        "authorizedSigner",
                        { name: "address", subField: "countryCode" },
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isPrimaryContactTheSame"
                name="isPrimaryContactTheSame"
                checked={formData.isPrimaryContactTheSame}
                onChange={handleCheckbox}
                className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="isPrimaryContactTheSame"
                className="ml-2 block text-gray-700"
              >
                Same Primary Contact
              </label>
            </div>
            {!formData.isPrimaryContactTheSame && (
              <div>
                <h2 className="text-xl font-bold mb-4">Primary Contact</h2>
                <div className="mb-4">
                  <label htmlFor={`title`} className="block text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id={`title`}
                    name={`title`}
                    value={formData.primaryContact.title}
                    onChange={(e) =>
                      handleNestedChange(
                        "primaryContact",
                        "title",
                        e.target.value
                      )
                    }
                    className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="lg:columns-2">
                  <div className="mb-4">
                    <label
                      htmlFor={`firstName`}
                      className="block text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id={`firstName`}
                      name={`firstName`}
                      value={formData.primaryContact.firstName}
                      onChange={(e) =>
                        handleNestedChange(
                          "primaryContact",
                          "firstName",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`lastName`} className="block text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id={`lastName`}
                      name={`lastName`}
                      value={formData.primaryContact.lastName}
                      onChange={(e) =>
                        handleNestedChange(
                          "primaryContact",
                          "lastName",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="lg:columns-2">
                  <div className="mb-4">
                    <label
                      htmlFor={`phoneNumber`}
                      className="block text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id={`phoneNumber`}
                      name={`phoneNumber`}
                      value={formData.primaryContact.phoneNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "primaryContact",
                          "phoneNumber",
                          "+1" + e.target.value.replace(/^\+1/, "")
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`email`} className="block text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      id={`email`}
                      name={`email`}
                      value={formData.primaryContact.email}
                      onChange={(e) =>
                        handleNestedChange(
                          "primaryContact",
                          "email",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded-md shadow"
            >
              Previous
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-purple-500 text-white rounded-md shadow"
            >
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-md shadow"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
