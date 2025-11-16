import { useQuery, useMutation } from "@tanstack/react-query";
import type { Promotion, SavedPromotion } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, BookmarkCheck, MapPin, Tag, Clock, UtensilsCrossed } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Promotions() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const { data: promotions = [], isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
  });

  const { data: savedPromotions = [], isLoading: savedLoading } = useQuery<SavedPromotion[]>({
    queryKey: ["/api/promotions/saved"],
  });

  const savePromotionMutation = useMutation({
    mutationFn: async (promotionId: string) => {
      return await apiRequest("POST", `/api/promotions/${promotionId}/save`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions/saved"] });
      toast({
        title: "Promotion saved!",
        description: "You can view your saved promotions in the Saved tab.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save promotion",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const unsavePromotionMutation = useMutation({
    mutationFn: async (promotionId: string) => {
      return await apiRequest("DELETE", `/api/promotions/${promotionId}/unsave`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions/saved"] });
      toast({
        title: "Promotion removed",
        description: "The promotion has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to remove promotion",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const redeemPromotionMutation = useMutation({
    mutationFn: async (promotionId: string) => {
      return await apiRequest("POST", `/api/promotions/${promotionId}/redeem`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions/saved"] });
      toast({
        title: "Promotion redeemed!",
        description: "Show this confirmation to the cashier to claim your discount.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to redeem promotion",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const isSaved = (promotionId: string) => {
    return savedPromotions.some(sp => sp.promotionId === promotionId);
  };

  const getSavedPromotion = (promotionId: string) => {
    return savedPromotions.find(sp => sp.promotionId === promotionId);
  };

  const formatExpiration = (date: Date | string) => {
    const expirationDate = new Date(date);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      return { text: "Expired", variant: "destructive" as const };
    } else if (daysUntilExpiration === 0) {
      return { text: "Expires today", variant: "destructive" as const };
    } else if (daysUntilExpiration <= 3) {
      return { text: `${daysUntilExpiration} days left`, variant: "destructive" as const };
    } else if (daysUntilExpiration <= 7) {
      return { text: `${daysUntilExpiration} days left`, variant: "secondary" as const };
    } else {
      return { text: `Expires ${expirationDate.toLocaleDateString()}`, variant: "secondary" as const };
    }
  };

  const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
    const saved = isSaved(promotion.id);
    const savedPromo = getSavedPromotion(promotion.id);
    const isRedeemed = savedPromo?.isRedeemed === 1;
    const expiration = formatExpiration(promotion.expiresAt);

    return (
      <Card className="overflow-hidden" data-testid={`card-promotion-${promotion.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg" data-testid={`text-restaurant-${promotion.id}`}>
                {promotion.restaurantName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{promotion.restaurantAddress}</span>
              </CardDescription>
            </div>
            <Badge variant="outline" className="shrink-0">
              <UtensilsCrossed className="w-3 h-3 mr-1" />
              {promotion.cuisineType}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pb-3">
          <div>
            <h4 className="font-semibold text-base mb-1" data-testid={`text-title-${promotion.id}`}>
              {promotion.title}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid={`text-description-${promotion.id}`}>
              {promotion.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-sm font-bold" data-testid={`badge-discount-${promotion.id}`}>
              <Tag className="w-3 h-3 mr-1" />
              {promotion.discountValue}
            </Badge>
            <Badge variant={expiration.variant} data-testid={`badge-expiration-${promotion.id}`}>
              <Clock className="w-3 h-3 mr-1" />
              {expiration.text}
            </Badge>
            {isRedeemed && (
              <Badge variant="secondary" data-testid={`badge-redeemed-${promotion.id}`}>
                ✓ Redeemed
              </Badge>
            )}
          </div>
          
          {promotion.terms && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Terms:</span> {promotion.terms}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-3">
          {!saved ? (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => savePromotionMutation.mutate(promotion.id)}
              disabled={savePromotionMutation.isPending}
              data-testid={`button-save-${promotion.id}`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          ) : (
            <>
              {!isRedeemed && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => redeemPromotionMutation.mutate(promotion.id)}
                  disabled={redeemPromotionMutation.isPending}
                  data-testid={`button-redeem-${promotion.id}`}
                >
                  Redeem Now
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => unsavePromotionMutation.mutate(promotion.id)}
                disabled={unsavePromotionMutation.isPending}
                data-testid={`button-unsave-${promotion.id}`}
              >
                <BookmarkCheck className="w-4 h-4 mr-2" />
                {isRedeemed ? "Remove" : "Unsave"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const savedPromotionIds = new Set(savedPromotions.map(sp => sp.promotionId));
  const savedPromotionsData = promotions.filter(p => savedPromotionIds.has(p.id));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-promotions">
          Restaurant Promotions
        </h1>
        <p className="text-muted-foreground">
          Discover exclusive deals from restaurants near Rutgers Newark campus
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="tabs-promotions">
          <TabsTrigger value="all" data-testid="tab-all-promotions">
            All Promotions
          </TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved-promotions">
            Saved ({savedPromotions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {promotionsLoading ? (
            <LoadingSkeleton />
          ) : promotions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No promotions available at the moment. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {savedLoading ? (
            <LoadingSkeleton />
          ) : savedPromotionsData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bookmark className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  You haven't saved any promotions yet.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("all")}
                  data-testid="button-browse-promotions"
                >
                  Browse Promotions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedPromotionsData.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
