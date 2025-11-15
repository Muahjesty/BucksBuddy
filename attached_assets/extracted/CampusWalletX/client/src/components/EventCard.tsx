import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  eventId?: string;
  title: string;
  category: string;
  price: number;
  date: Date | string;
  imageUrl?: string;
  location?: string;
}

export default function EventCard({ 
  eventId,
  title, 
  category, 
  price, 
  date,
  imageUrl,
  location = "Campus Center"
}: EventCardProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const payMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/events/pay", {
        eventId: eventId || undefined,
        eventTitle: title,
        amount: price,
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Payment Successful!",
        description: `You've paid $${price.toFixed(2)} for ${title}. +50 reward points earned!`,
      });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePay = () => {
    payMutation.mutate();
  };

  return (
    <div className="overflow-hidden glass-card hover:glass-strong hover:scale-[1.02] transition-all duration-300 rounded-3xl" data-testid={`card-event-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <p className="font-bold text-base mb-1 text-foreground" data-testid="text-event-title">{title}</p>
            <p className="text-xs text-foreground/60 font-medium">{category}</p>
          </div>
          <p className="font-bold text-lg text-primary drop-shadow-sm" data-testid="text-event-price">
            ${price.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">{format(dateObj, "MMM d, yyyy • h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{location}</span>
          </div>
        </div>
        <Button 
          size="sm" 
          className="w-full rounded-xl font-semibold" 
          onClick={handlePay}
          disabled={payMutation.isPending}
          data-testid="button-pay-event"
        >
          {payMutation.isPending ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}
