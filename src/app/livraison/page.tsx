import { InfoView } from '@/components/InfoView';
import { INFO_PAGES } from '@/data/info';

export default function LivraisonPage() {
  return <InfoView content={INFO_PAGES['/livraison']!} />;
}
