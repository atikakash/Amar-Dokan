"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

type Settings = {
  storeName: string;
  supportEmail: string;
  currency: string;
  lowStockDefault: string;
  orderApproval: boolean;
  maintenanceMode: boolean;
};

const defaults: Settings = {
  storeName: "MewMew Pet Shop",
  supportEmail: "support@mewmewpet.shop",
  currency: "BDT",
  lowStockDefault: "5",
  orderApproval: true,
  maintenanceMode: false,
};

const key = "ecommerce_admin_settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (raw) setSettings({ ...defaults, ...JSON.parse(raw) });
  }, []);

  function save() {
    window.localStorage.setItem(key, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <>
      <PageHeader title="Settings" description="Operational defaults used by the admin workspace." />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader title="Store Configuration" description="General store identity and order defaults." />
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Store Name">
                <Input value={settings.storeName} onChange={(event) => setSettings({ ...settings, storeName: event.target.value })} />
              </Field>
              <Field label="Support Email">
                <Input type="email" value={settings.supportEmail} onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })} />
              </Field>
              <Field label="Currency">
                <Select value={settings.currency} onChange={(event) => setSettings({ ...settings, currency: event.target.value })}>
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Select>
              </Field>
              <Field label="Default Low Stock">
                <Input
                  type="number"
                  min="0"
                  value={settings.lowStockDefault}
                  onChange={(event) => setSettings({ ...settings, lowStockDefault: event.target.value })}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={settings.orderApproval}
                  onChange={(event) => setSettings({ ...settings, orderApproval: event.target.checked })}
                />
                Require order review before fulfillment
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(event) => setSettings({ ...settings, maintenanceMode: event.target.checked })}
                />
                Maintenance mode
              </label>
            </div>
            <div className="flex items-center justify-end gap-3">
              {saved ? <span className="text-sm text-brand-700">Saved</span> : null}
              <Button onClick={save}>
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="API Connection" description="Current backend target for admin operations." />
          <CardContent className="grid gap-3 text-sm">
            <div className="rounded-md border border-border bg-surface p-3">
              <p className="font-medium text-ink">Base URL</p>
              <p className="mt-1 break-all text-muted">{process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"}</p>
            </div>
            <div className="rounded-md border border-border bg-surface p-3">
              <p className="font-medium text-ink">Auth</p>
              <p className="mt-1 text-muted">Sanctum bearer token</p>
            </div>
            <div className="rounded-md border border-border bg-surface p-3">
              <p className="font-medium text-ink">Allowed Roles</p>
              <p className="mt-1 text-muted">Admin, Manager</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
