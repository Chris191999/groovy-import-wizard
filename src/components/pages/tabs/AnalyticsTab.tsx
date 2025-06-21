
import { TabsContent } from "@/components/ui/tabs";
import AdvancedPerformanceMetrics from "@/components/trading/AdvancedPerformanceMetrics";
import { Trade } from "@/types/trade";

interface AnalyticsTabProps {
  trades: Trade[];
}

const AnalyticsTab = ({ trades }: AnalyticsTabProps) => {
  return (
    <TabsContent value="analytics">
      <AdvancedPerformanceMetrics trades={trades} detailed={true} />
    </TabsContent>
  );
};

export default AnalyticsTab;
