import { InfoView } from '@/components/InfoView';
import { INFO_PAGES } from '@/data/info';

export default function GuideDesTaillesPage() {
  return <InfoView content={INFO_PAGES['/guide-des-tailles']!} />;
}
