
import { TabsContent } from "@/components/ui/tabs";
import EnhancedAdvancedMetrics from "@/components/trading/EnhancedAdvancedMetrics";
import { Trade } from "@/types/trade";

interface AdvancedTabProps {
  trades: Trade[];
}

const AdvancedTab = ({ trades }: AdvancedTabProps) => {
  return (
    <TabsContent value="advanced">
      <EnhancedAdvancedMetrics trades={trades} />
    </TabsContent>
  );
};

export default AdvancedTab;
