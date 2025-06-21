
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import JSZip from 'jszip';
import { parseCsvData } from "./utils/csvParser";
import { processAndUploadImages } from "./utils/imageProcessor";
import { validateZipFile, findAndValidateCsv } from "./utils/zipValidator";
import SecurityInfoDisplay from "./components/SecurityInfoDisplay";
import { useAuth } from "@/hooks/useAuth";

interface ImportZipHandlerProps {
  onImport: (trades: Trade[]) => void;
}

const ImportZipHandler = ({ onImport }: ImportZipHandlerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityInfo, setSecurityInfo] = useState<{
    filesProcessed: number;
    imagesFound: number;
    securityWarnings: string[];
  } | null>(null);

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const zipValidation = validateZipFile(file);
    if (!zipValidation.isValid) {
      toast({
        title: "Security Error",
        description: zipValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to import data.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    let filesProcessed = 0;
    const allWarnings: string[] = [];
    let totalImagesFound = 0;
    let totalImagesUploaded = 0;

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      const { csvContent, warnings: csvWarnings } = await findAndValidateCsv(zipContent);
      filesProcessed++;
      allWarnings.push(...csvWarnings);

      const tradesFromCsv = parseCsvData(csvContent);
      const finalTrades: Trade[] = [];

      for (const trade of tradesFromCsv) {
        const tradeWithId = { ...trade, id: trade.id || crypto.randomUUID() };

        const result = await processAndUploadImages(tradeWithId, zipContent, user.id);
        
        finalTrades.push(result.tradeWithImageUrls);
        allWarnings.push(...result.warnings);
        totalImagesFound += result.imagesFound;
        totalImagesUploaded += result.imagesUploaded;
      }
      
      filesProcessed += totalImagesFound;
      
      setSecurityInfo({
        filesProcessed,
        imagesFound: totalImagesFound,
        securityWarnings: allWarnings,
      });
      
      onImport(finalTrades);

      toast({
        title: "Import Complete",
        description: `Processed ${finalTrades.length} trades. Found ${totalImagesFound} images, uploaded ${totalImagesUploaded} new images.`,
      });
      
    } catch (error) {
      console.error('Zip import error:', error);
      toast({
        title: "Security Error",
        description: error instanceof Error ? error.message : "Failed to process zip file safely",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded">
        <Shield className="h-4 w-4" />
        <span>Secure import: File validation, size limits, and encrypted storage</span>
      </div>

      <div>
        <Label htmlFor="zip-file">Upload ZIP File (with CSV + Images, Max 50MB)</Label>
        <Input
          id="zip-file"
          type="file"
          accept=".zip,application/zip"
          onChange={handleZipUpload}
          className="mt-1"
          disabled={isProcessing}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {isProcessing ? "Processing securely..." : "Upload a ZIP file containing trades.csv and images folder"}
        </p>
      </div>

      {securityInfo && <SecurityInfoDisplay securityInfo={securityInfo} />}
    </div>
  );
};

export default ImportZipHandler;
