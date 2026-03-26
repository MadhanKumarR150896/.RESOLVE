import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  DisplayBox,
  Input,
  TextArea,
  SelectGroup,
} from "../components/ReusableElements";
import { supabase } from "../../supabase/supabaseClient";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateTicketInfo } from "../../utils/ticketSamples";

type Mode = "insert" | "update";
type App = { id: string; name: string };

type SevEnum = "sev 5" | "sev 4" | "sev 3" | "sev 2" | "sev 1";

export type TicketFormValues = {
  application?: string;
  severity?: SevEnum;
  description?: string;
  comments?: string;
};

export const UserTicketForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<TicketFormValues>();

  const params = useParams();
  const [mode, setMode] = useState<Mode>("insert");
  const [apps, setApps] = useState<App[] | null>(null);

  const output: SubmitHandler<TicketFormValues> = (data) => console.log(data);

  useEffect(() => {
    const loadApps = async () => {
      const { data, error } = await supabase
        .from("apps")
        .select(`id,name`)
        .order("name", { ascending: true })
        .overrideTypes<App[], { merge: false }>();

      if (error) return;
      setApps(data);
    };

    loadApps();
  }, []);

  useEffect(() => {
    const checkMode = () => {
      if (params?.ticketId) setMode("update");
    };
    checkMode();
  }, [params.ticketId]);

  return (
    <form
      onSubmit={handleSubmit(output)}
      className="px-24 py-20 flex flex-col relative"
    >
      <div className="grid grid-cols-3 gap-12">
        <DisplayBox
          title="Ticket Number"
          placeHolderText="#######"
        ></DisplayBox>

        <DisplayBox
          title="Date and Time"
          placeHolderText="----/--/-- --:--:--"
        ></DisplayBox>

        <DisplayBox
          title="Created by"
          placeHolderText="Madhan Kumar"
        ></DisplayBox>

        <DisplayBox title="Status" placeHolderText="Open"></DisplayBox>

        <div className="flex flex-col gap-1">
          <SelectGroup
            error={errors.application ? errors.application.message : null}
            disabled={mode === "update"}
            label="Application"
            id="application"
            {...register("application", {
              required: "Select an application",
            })}
          >
            <option value="">Select Application</option>
            {apps &&
              apps.map((app) => {
                return (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                );
              })}
          </SelectGroup>
        </div>

        <div className="flex flex-col gap-1">
          <SelectGroup
            error={errors.severity ? errors.severity.message : null}
            label="Severity"
            id="severity"
            {...register("severity", {
              required: "Select a severity",
            })}
          >
            <option value="">Select Severity</option>
            <option value="sev 5">Sev 5 (Minor)</option>
            <option value="sev 4">Sev 4 (Low)</option>
            <option value="sev 3">Sev 3 (Medium)</option>
            <option value="sev 2">Sev 2 (High)</option>
            <option value="sev 1">Sev 1 (Critical)</option>
          </SelectGroup>
        </div>

        <div className="col-span-2">
          <Input
            error={errors.description ? errors.description.message : null}
            label="Description"
            disabled={mode === "update"}
            id="description"
            type="text"
            {...register("description", {
              required: "Update a brief description about the issue",
            })}
          />
        </div>

        <DisplayBox title="Assigned to" placeHolderText="NA"></DisplayBox>

        <div className="col-span-3 grid grid-cols-2 gap-12">
          <TextArea label="Comments" id="comments" {...register("comments")} />

          <div className="flex flex-col gap-2">
            <span className="font-bold">Previous Updates</span>
            <div className="input h-32 overflow-y-auto"></div>
          </div>
        </div>
      </div>
      <Button
        label="Submit"
        type="submit"
        className="w-60 py-3 text-xl mt-16 place-self-center"
      />
      <Button
        type="button"
        label="Use me"
        variant="faker"
        className="px-4 py-3 absolute right-24 bottom-20"
        onClick={() => {
          const result = generateTicketInfo();

          setValue("description", result.description, { shouldValidate: true });
          setValue("comments", result.comments, { shouldValidate: true });
          setValue("severity", result.severity, { shouldValidate: true });
        }}
      />
    </form>
  );
};
