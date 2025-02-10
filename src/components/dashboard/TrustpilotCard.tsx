
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Flag, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function TrustpilotCard() {
  const { data: reviewStats, isLoading } = useQuery({
    queryKey: ['trustpilotStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trustpilot_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stats = {
        newReviews: data.filter(review => review.status === 'new').length,
        flaggedReviews: data.filter(review => review.status === 'flagged').length,
        averageRating: data.length > 0 
          ? data.reduce((acc, review) => acc + review.rating, 0) / data.length 
          : 0
      };

      return stats;
    }
  });

  return (
    <Card className="bg-yellow-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Trustpilot Reviews
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Reviews</span>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold">{reviewStats?.newReviews || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Flagged Reviews</span>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold">{reviewStats?.flaggedReviews || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold">
                    {reviewStats?.averageRating.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
