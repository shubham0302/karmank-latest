import React, { useMemo } from 'react';
import Card from '../Card';
import SectionTitle from '../SectionTitle';
import { DATA } from '../../data/data';
import { getText } from '../../utils/helpers'; // Import getText

const NumerologyTraitsTab = ({ report, gender }) => {
    if (!report) return null;
    const { destinyNumber } = report;
    const traits = DATA.destinyTraits[destinyNumber];
    const professions = DATA.destinyProfessions[destinyNumber];
    
    // Assuming 'language' prop will be passed, defaulting to 'en' for now
    const language = 'en'; 

    const supportAnalysis = useMemo(() => {
        if (!professions || !professions.supportNeeded) return [];
        const supportNeededText = getText(professions.supportNeeded, language);
        const supportNumbers = supportNeededText.match(/\d+/g)?.map(Number) || [];
        return supportNumbers.map(num => ({
            number: num,
            isPresent: report.baseKundliGrid[num] > 0
        }));
    }, [professions, report.baseKundliGrid, language]);

    if (!traits) {
        return <Card><p>No detailed traits available for Destiny Number {destinyNumber}.</p></Card>;
    }

    const TraitItem = ({ label, value }) => (
        <div className="bg-gray-900/50 p-3 rounded-md">
            <h4 className="font-semibold text-yellow-500 text-sm">{label}</h4>
            <p className="text-gray-300">{value}</p>
        </div>
    );

    const ProfessionColumn = ({ title, items, type }) => {
        const typeStyles = {
            suggested: { bg: 'bg-green-500/10', text: 'text-green-400' },
            neutral: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
            ideal: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
            avoid: { bg: 'bg-red-500/10', text: 'text-red-400' }
        };
        const styles = typeStyles[type];

        return (
            <div className={`p-4 rounded-lg ${styles.bg} h-full`}>
                <h4 className={`font-bold ${styles.text} mb-2 text-center`}>{title}</h4>
                <ul className="space-y-1 text-center">
                    {items.map(item => (
                        <li key={getText(item, language)} className="text-gray-300 text-sm">
                            {getText(item, language)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <SectionTitle>Detailed Traits for Destiny Number {destinyNumber}</SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <TraitItem label="Planet (Grah)" value={getText(traits.Planet, language)} />
                    <TraitItem label="Finance" value={getText(traits.Finance, language)} />
                    <TraitItem label="Health Defects" value={getText(traits['Health Defects'], language)} />
                    <TraitItem label="Lucky Days" value={getText(traits['Lucky Days'], language)} />
                    <TraitItem label="Lucky Colours" value={getText(traits['Lucky Colours'], language)} />
                    <TraitItem label="Lucky Jewels" value={getText(traits['Lucky Jewels'], language)} />
                    <TraitItem label="Important Years" value={getText(traits['Important Years'], language)} />
                    <TraitItem label="Friendly Number" value={getText(traits['Friendly Number'], language)} />
                    <TraitItem label="Good Quality" value={getText(traits['Good Quality'], language)} />
                    <TraitItem label="Spiritual Insights" value={getText(traits['Spiritual Insights'], language)} />
                    <TraitItem label="Drawback" value={getText(traits.Drawback, language)} />
                    <div className="md:col-span-2 lg:col-span-3">
                        <TraitItem 
                            label={gender === 'Female' ? 'As Wife' : 'As Husband'} 
                            value={getText(traits[gender === 'Female' ? 'As Wife' : 'As Husband'], language)} 
                        />
                    </div>
                </div>
            </Card>
            
            {professions && (
                <Card>
                    <SectionTitle>Career & Profession Profile</SectionTitle>
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <ProfessionColumn title="Suggested Professions" items={professions.suggested} type="suggested" />
                            <ProfessionColumn title="Neutral Fields" items={professions.neutral} type="neutral" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ProfessionColumn title="Ideal Corporate Roles" items={professions.idealCorporate} type="ideal" />
                            <ProfessionColumn title="Fields to Avoid" items={professions.avoid} type="avoid" />
                        </div>
                        <div className="p-4 rounded-lg bg-indigo-500/10 text-center">
                            <h4 className="font-bold text-indigo-400 mb-2">Support Needed</h4>
                            <p className="text-gray-300 text-sm mb-3">{getText(professions.supportNeeded, language)}</p>
                            <div className="flex justify-center flex-wrap gap-4">
                                {supportAnalysis.map(item => (
                                    <div key={item.number} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${item.isPresent ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {item.isPresent ? '✅' : '⚠️'}
                                        <span>Number {item.number} {item.isPresent ? 'Present' : 'Missing'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default NumerologyTraitsTab;