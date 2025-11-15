import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface ContactProps {
  setQrData: Dispatch<SetStateAction<string>>;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
}

export default function Contact({ setQrData }: ContactProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    url: "",
  });

  const generateVCard = (contact: ContactInfo): string => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
    return vcard;
  };

  useEffect(() => {
    if (
      contactInfo.firstName ||
      contactInfo.lastName ||
      contactInfo.phone ||
      contactInfo.email
    ) {
      setQrData(generateVCard(contactInfo));
    } else {
      setQrData("");
    }
  }, [contactInfo, setQrData]);

  return (
    <div className="space-y-4">
      <div className="grid grid-col-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={contactInfo.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setContactInfo({ ...contactInfo, firstName: e.target.value })
            }
            placeholder="John"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={contactInfo.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setContactInfo({ ...contactInfo, lastName: e.target.value })
            }
            placeholder="Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setContactInfo({ ...contactInfo, phone: e.target.value })
          }
          placeholder="+1 (555) 123-4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setContactInfo({ ...contactInfo, email: e.target.value })
          }
          placeholder="john.doe@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization
        </label>
        <input
          type="text"
          value={contactInfo.organization}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setContactInfo({ ...contactInfo, organization: e.target.value })
          }
          placeholder="Company Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          value={contactInfo.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setContactInfo({ ...contactInfo, url: e.target.value })
          }
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
}
