import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";
import { Calendar, Download, ZoomIn, ZoomOut } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  date: string;
  label?: string;
}

interface PhotoComparisonViewerProps {
  photos: Photo[];
}

export function PhotoComparisonViewer({ photos }: PhotoComparisonViewerProps) {
  const { t } = useTranslation();
  const [selectedPhotos, setSelectedPhotos] = useState<[number, number]>([
    0, 1,
  ]);
  const [opacity, setOpacity] = useState(50);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  if (photos.length < 2) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            {t("needTwoPhotosToCompare")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const [photo1Index, photo2Index] = selectedPhotos;
  const photo1 = photos[photo1Index];
  const photo2 = photos[photo2Index];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("photoComparison")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("beforePhoto")}
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={photo1Index}
              onChange={(e) =>
                setSelectedPhotos([Number(e.target.value), photo2Index])
              }
              aria-label={t("selectBeforePhoto")}
            >
              {photos.map((photo, index) => (
                <option key={photo.id} value={index}>
                  {photo.label || new Date(photo.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("afterPhoto")}
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={photo2Index}
              onChange={(e) =>
                setSelectedPhotos([photo1Index, Number(e.target.value)])
              }
              aria-label={t("selectAfterPhoto")}
            >
              {photos.map((photo, index) => (
                <option key={photo.id} value={index}>
                  {photo.label || new Date(photo.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Viewer */}
        <div
          ref={containerRef}
          className="relative aspect-video bg-muted rounded-lg overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* Base Image */}
          <img
            src={photo1.url}
            alt={`Photo from ${photo1.date}`}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Overlay Image */}
          <img
            src={photo2.url}
            alt={`Photo from ${photo2.date}`}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: opacity / 100 }}
          />

          {/* Comparison Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
            style={{ left: `${opacity}%` }}
          />
        </div>

        {/* Opacity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t("before")}</span>
            <span>{t("after")}</span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
            max={100}
            step={1}
            className="w-full"
            aria-label={t("adjustOpacity")}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
            aria-label={t("zoomOut")}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            aria-label={t("zoomIn")}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
            className="ml-auto"
          >
            {t("resetZoom")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label={t("downloadComparison")}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Date Information */}
        <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>{new Date(photo1.date).toLocaleDateString()}</span>
          <span>{new Date(photo2.date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
