import React from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import { DATA } from "../../data/data";
import { getText } from "../../utils/helpers";
import { GradientText } from "../GradientText";
import { getRemedyData } from "../../utils/localData";

const GeneralRemediesTab = ({ report, language = "en" }) => {
  if (!report?.relevantData) {
    return (
      <Card>
        <p className="text-yellow-400">Report data not fully loaded.</p>
      </Card>
    );
  }

  const basicRemedy = getRemedyData(report, report.basicNumber);
  const destinyRemedy = getRemedyData(report, report.destinyNumber);

  const RemedySection = ({ title, number, remedyData }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 print:text-lg print:mb-2">
        {title} (Number: {number})
      </h2>
      <div className="space-y-4 text-white/90 print:space-y-2 print:text-sm">
        <div>
          <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">
            General Advice
          </h3>
          <p>{getText(remedyData.general, language)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">
            Mantra
          </h3>
          <p className="italic">{getText(remedyData.mantra, language)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-300 text-lg mb-1 print:text-sm print:mb-0.5">
            Donations
          </h3>
          <p>{getText(remedyData.donation, language)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pdf-page-break-after" style={{ pageBreakAfter: "always" }}>
      {/* Remedies for Basic Number */}
      <Card className="print:mb-4" style={{ pageBreakInside: "avoid" }}>
        <SectionTitle>General Remedies</SectionTitle>
        <RemedySection
          title="Remedies for Basic Number"
          number={report.basicNumber}
          remedyData={basicRemedy}
        />
      </Card>

      {/* Remedies for Destiny Number - Same Page */}
      {report.basicNumber !== report.destinyNumber && (
        <Card className="print:mb-4" style={{ pageBreakInside: "avoid" }}>
          <RemedySection
            title="Remedies for Destiny Number"
            number={report.destinyNumber}
            remedyData={destinyRemedy}
          />
        </Card>
      )}
    </div>
  );
};

export default GeneralRemediesTab;
