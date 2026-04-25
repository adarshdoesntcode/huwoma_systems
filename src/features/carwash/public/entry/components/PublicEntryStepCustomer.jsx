import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Circle, X } from "lucide-react";
import { TOUCH_CLEAN_INTERACTION_CLASS } from "../publicEntryShared";
import { capitalizeName, normalizeContact } from "../publicEntryUtils";

function PublicEntryStepCustomer({
  form,
  errors,
  recentCustomers,
  hasSearchedContact,
  selectedMatchedCustomerId,
  useManualCustomerLookup,
  customerContext,
  onContactChange,
  onSelectRecentCustomer,
  onRemoveRecentCustomer,
  onSelectMatchedCustomer,
  onNewCustomerNameChange,
  isContextLoading,
}) {
  const hasMatchedCustomer = Boolean(customerContext?.customer);
  const [pendingDeleteCustomer, setPendingDeleteCustomer] = useState(null);
  const contactInputRef = useRef(null);
  const newCustomerNameInputRef = useRef(null);
  const showSavedCustomerCards =
    recentCustomers.length > 0 && !useManualCustomerLookup;
  const isNewCustomer =
    !showSavedCustomerCards && hasSearchedContact && !hasMatchedCustomer;

  useEffect(() => {
    if (showSavedCustomerCards) return;

    const focusTimer = window.setTimeout(() => {
      const inputNode = isNewCustomer
        ? newCustomerNameInputRef.current
        : contactInputRef.current;
      inputNode?.focus({ preventScroll: true });
    }, 80);

    return () => window.clearTimeout(focusTimer);
  }, [isNewCustomer, showSavedCustomerCards]);

  return (
    <div className="space-y-5">
      {showSavedCustomerCards && (
        <div className="space-y-2">
          <Label>Saved Customer</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {recentCustomers.map((recentCustomer) => (
              <div
                key={recentCustomer.customerContact}
                role="button"
                tabIndex={0}
                className={cn(
                  "relative w-full rounded-xl border p-4 text-left transition-colors transition-shadow duration-200",
                  TOUCH_CLEAN_INTERACTION_CLASS,
                  normalizeContact(form.customerContact) ===
                    normalizeContact(recentCustomer.customerContact)
                    ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                    : "",
                )}
                onClick={() => onSelectRecentCustomer(recentCustomer)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectRecentCustomer(recentCustomer);
                  }
                }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "absolute w-7 h-7 right-1.5 top-1.5 text-muted-foreground/70 hover:text-destructive",
                    TOUCH_CLEAN_INTERACTION_CLASS,
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPendingDeleteCustomer(recentCustomer);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="pr-4 mb-1 font-semibold text-primary text-wrap">
                  {recentCustomer.customerName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {recentCustomer.customerContact}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-center text-muted-foreground">
            Select a customer to proceed.
          </p>
          <AlertDialog
            open={Boolean(pendingDeleteCustomer)}
            onOpenChange={(open) => {
              if (!open) {
                setPendingDeleteCustomer(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove saved customer?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove{" "}
                  <span className="font-medium text-foreground">
                    {pendingDeleteCustomer?.customerName}
                  </span>{" "}
                  ({pendingDeleteCustomer?.customerContact}) from saved
                  suggestions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={TOUCH_CLEAN_INTERACTION_CLASS}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  className={TOUCH_CLEAN_INTERACTION_CLASS}
                  onClick={() => {
                    if (!pendingDeleteCustomer) return;
                    onRemoveRecentCustomer(
                      pendingDeleteCustomer.customerContact,
                    );
                    setPendingDeleteCustomer(null);
                  }}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {!showSavedCustomerCards && (
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label>
              {errors.customerContact ? (
                <span className="text-destructive">
                  {errors.customerContact}
                </span>
              ) : (
                "Contact Number"
              )}
            </Label>
            <Input
              ref={contactInputRef}
              value={form.customerContact}
              className="min-h-12"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit number"
              onChange={(event) => onContactChange(event.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Enter your contact number and tap{" "}
            <span className="font-medium">Next</span>
          </p>
        </div>
      )}

      {isContextLoading && (
        <div className="p-4 space-y-3 border rounded-xl bg-slate-50/80">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-[#058299] animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#058299]" />
            </div>
            Checking customer contact...
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-2 rounded bg-slate-200 animate-pulse" />
            <div className="w-1/2 h-2 rounded bg-slate-200 animate-pulse [animation-delay:160ms]" />
          </div>
        </div>
      )}

      {!showSavedCustomerCards && hasMatchedCustomer && (
        <div className="space-y-2">
          <Label>
            {errors.matchedCustomer ? (
              <span className="text-destructive">{errors.matchedCustomer}</span>
            ) : (
              "Match Found"
            )}
          </Label>
          <button
            type="button"
            className={cn(
              "relative w-full rounded-xl border p-4 text-left transition-all",
              TOUCH_CLEAN_INTERACTION_CLASS,
              selectedMatchedCustomerId === customerContext.customer._id
                ? "border-[#058299] bg-gradient-to-r from-[#058299]/10 via-[#058299]/5 to-[#fff] shadow-[0_10px_24px_-16px_rgba(5,130,153,0.55)]"
                : "",
            )}
            onClick={() => onSelectMatchedCustomer(customerContext.customer._id)}
          >
            <span className="absolute top-3 right-3">
              {selectedMatchedCustomerId === customerContext.customer._id ? (
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#058299]">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-muted" />
              )}
            </span>
            <div className="pr-4 font-semibold text-primary text-wrap">
              {customerContext.customer.customerName}
            </div>
            <div className="text-sm text-muted-foreground">
              {customerContext.customer.customerContact}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {customerContext.vehicles.length} saved vehicle
              {customerContext.vehicles.length > 1 ? "s" : ""} found
            </div>
          </button>
        </div>
      )}

      {isNewCustomer && (
        <div className="grid gap-2">
          <Label>
            {errors.customerName ? (
              <span className="text-destructive">{errors.customerName}</span>
            ) : (
              "Customer Name"
            )}
          </Label>
          <Input
            ref={newCustomerNameInputRef}
            value={form.customerName}
            className="min-h-12"
            placeholder="Full name"
            autoComplete="name"
            onChange={(event) => onNewCustomerNameChange(event.target.value)}
            onBlur={(event) =>
              onNewCustomerNameChange(capitalizeName(event.target.value))
            }
          />
        </div>
      )}
    </div>
  );
}

export default PublicEntryStepCustomer;
