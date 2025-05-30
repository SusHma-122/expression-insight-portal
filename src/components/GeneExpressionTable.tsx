
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart } from 'lucide-react';
import { GeneExpression } from '@/services/api';

interface GeneExpressionTableProps {
  genes: GeneExpression[];
}

const GeneExpressionTable = ({ genes }: GeneExpressionTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Top Differentially Expressed Genes
        </CardTitle>
        <CardDescription>
          Genes ranked by statistical significance and fold change
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Gene Symbol</th>
                <th className="text-left py-2">Log2 Fold Change</th>
                <th className="text-left py-2">P-value</th>
                <th className="text-left py-2">Adj. P-value</th>
                <th className="text-left py-2">Regulation</th>
              </tr>
            </thead>
            <tbody>
              {genes.map((gene, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium text-blue-600">{gene.symbol}</td>
                  <td className="py-2">{gene.logFC.toFixed(2)}</td>
                  <td className="py-2">{gene.pValue.toFixed(3)}</td>
                  <td className="py-2">{gene.adjPValue.toFixed(3)}</td>
                  <td className="py-2">
                    <Badge 
                      variant={gene.logFC > 0 ? "destructive" : "secondary"}
                      className={gene.logFC > 0 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                    >
                      {gene.logFC > 0 ? 'Up' : 'Down'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneExpressionTable;
