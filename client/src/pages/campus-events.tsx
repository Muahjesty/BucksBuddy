import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CampusEvent } from "@shared/schema";
import { format } from "date-fns";

export default function CampusEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: events = [], isLoading } = useQuery<CampusEvent[]>({
    queryKey: ["/api/campus-events"],
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(events.map(e => e.category))).sort();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Tech": "hsl(217, 91%, 35%)",
      "Career": "hsl(142, 76%, 30%)",
      "Finance": "hsl(34, 92%, 45%)",
      "Academic": "hsl(271, 91%, 35%)",
      "Wellness": "hsl(165, 82%, 35%)",
      "Sports": "hsl(0, 84%, 40%)",
      "Cultural": "hsl(280, 70%, 40%)",
      "Social": "hsl(195, 82%, 35%)",
      "Community": "hsl(88, 60%, 35%)",
    };
    return colors[category] || "hsl(0, 0%, 45%)";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campus Events</h1>
        <p className="text-muted-foreground mt-1">Discover events happening around campus</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-events"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="hover-elevate flex flex-col"
              data-testid={`card-event-${event.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <Badge 
                    style={{ 
                      backgroundColor: getCategoryColor(event.category),
                      color: 'white'
                    }}
                    className="shrink-0"
                  >
                    {event.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  {event.organizer && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.organizer}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">
                      {event.isFree ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        <span>Paid Event</span>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
