"use client";

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
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

function TestComponent() {
  const [date, setDate] = React.useState<Date>();
  return (
    <div className="p-2 text-4xl">
      <div className="flex flex-col space-y-4">
        <Button variant={"default"} size={"lg"} className="w-40">
          Click me!
        </Button>
        <Button
          className="w-40"
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
          className="w-40"
          variant="destructive"
          onClick={() =>
            toast.success("Great job!", {
              description: "You did it!",
            })
          }
        >
          Show Success Toast
        </Button>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>

        <div>
          <Input id="name" placeholder="Enter your name" className="w-40" />
        </div>

        <div>
          <InputOTP maxLength={6}>
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

        <div>
          <Textarea
            className="w-60"
            id="message"
            placeholder="Enter your message"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input type="file"/>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
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
  );
}

export default TestComponent;
