import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import campusMapPdf from "@assets/Grid_Map_2012_1763309358623.pdf";

export default function CampusMap() {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = campusMapPdf;
    link.download = 'Rutgers_Newark_Campus_Map.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Campus Map</h1>
            <p className="text-muted-foreground">Navigate Rutgers University-Newark</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            aria-label="Zoom out campus map"
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            aria-label="Zoom in campus map"
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            onClick={handleDownload}
            aria-label="Download campus map PDF"
            data-testid="button-download-map"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Map
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Rutgers Newark Campus Grid Map</CardTitle>
          <CardDescription>
            View buildings, parking, transit stations, and campus facilities. Use zoom controls to explore details.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full pb-6">
          <div className="h-full overflow-auto border rounded-md bg-muted/50">
            <div
              className="max-w-full"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <iframe
                src={campusMapPdf}
                className="w-full border-0"
                style={{ height: `${100 / (zoom / 100)}vh` }}
                title="Rutgers Newark Campus Map"
                data-testid="iframe-campus-map"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Campus Buildings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Key academic buildings: Dana Library, Conklin Hall, Boyden Hall, Hill Hall, and more.
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transit Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Newark Light Rail stations at Broad Street and Washington Street provide easy campus access.
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Parking Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Multiple parking facilities marked with 'P' throughout campus for student and visitor use.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
