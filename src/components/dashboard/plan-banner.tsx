import { Crown, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/format";
import { FREE_ITEM_LIMIT } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  plan: "free" | "premium";
  expiresAt: string | null;
  activeItems: number;
}

export function PlanBanner({ plan, expiresAt, activeItems }: Props) {
  if (plan === "premium") {
    return (
      <Card className="border-accent/50 bg-accent/10">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Crown className="size-6" />
          </span>
          <div>
            <p className="font-semibold">Premium plan active</p>
            <p className="text-sm text-muted-foreground">
              Unlimited menu items and featured placement{expiresAt ? `. Current period ends ${formatDate(expiresAt)}.` : "."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </span>
          <div>
            <p className="font-semibold">
              Free plan: {activeItems} of {FREE_ITEM_LIMIT} active items used
            </p>
            <p className="text-sm text-muted-foreground">Upgrade to publish unlimited items, get a Premium badge and featured placement.</p>
          </div>
        </div>
        <ButtonLink href="/dashboard/vendor/subscription">Upgrade to Premium</ButtonLink>
      </CardContent>
    </Card>
  );
}
