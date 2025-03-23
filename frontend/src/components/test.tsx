import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

function TestComponent() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="bg-background container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Component Preview</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        A showcase of UI components
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Buttons Section */}
        <div className="-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Buttons</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Various button styles and variants
          </p>

          <div className="mb-6 flex flex-wrap gap-4">
            <Button variant="default" size="default">
              Default
            </Button>
            <Button variant="secondary" size="default">
              Secondary
            </Button>
            <Button variant="outline" size="default">
              Outline
            </Button>
            <Button variant="ghost" size="default">
              Ghost
            </Button>
            <Button variant="destructive" size="default">
              Destructive
            </Button>
          </div>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="space-y-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                toast.warning("Uh oh! Something went wrong.", {
                  description: "There was a problem with your request.",
                  action: {
                    label: "Try Again",
                    onClick: () => console.log("Try Again"),
                  },
                })
              }
            >
              Show Warning Toast
            </Button>

            <Button
              className="w-full"
              variant="destructive"
              onClick={() =>
                toast.success("Great job!", {
                  description: "You did it!",
                })
              }
            >
              Show Success Toast
            </Button>
          </div>
        </div>

        {/* Form Inputs Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Form Inputs</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Text inputs and form controls
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Enter your name" />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium"
              >
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                File Upload
              </label>
              <Input type="file" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Date & Time</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Date pickers and calendars
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Date Picker
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-2 text-xl font-semibold">Verification</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            OTP and verification inputs
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium">
              One-Time Password
            </label>
            <InputOTP maxLength={6} className="justify-center">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestComponent;
