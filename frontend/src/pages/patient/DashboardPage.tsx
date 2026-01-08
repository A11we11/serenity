import { useConsultations } from "../../features/consultations/hooks/useConsultation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";
import { Plus, Video, Clock } from "lucide-react";
import { format } from "date-fns";

export function PatientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { consultations, isLoading } = useConsultations();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {t("welcomeBack")}, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">{t("yourHealthDashboard")}</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/consultations/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              {t("newConsultation")}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>{t("recentConsultations")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">{t("loading")}...</p>
          ) : consultations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {t("noConsultations")}
              </p>
              <Link to="/consultations/new">
                <Button variant="outline">{t("startNewConsultation")}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.slice(0, 5).map((consultation: any) => (
                <Link
                  key={consultation.id}
                  to={`/consultations/${consultation.id}`}
                  className="block"
                >
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {consultation.doctor?.name || t("awaitingDoctor")}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(consultation.createdAt), "PPp")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t("viewDetails")}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
