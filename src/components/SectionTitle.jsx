import { GradientText } from './GradientText';

const SectionTitle = ({ children, className = '' }) => (
    <GradientText
        as="h2"
        size="2xl"
        className={`mb-4 font-serif tracking-wider ${className}`}
    >
        {children}
    </GradientText>
);

export default SectionTitle;