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
import type { AppType } from "../../supabase/requiredTypes";
import { useAuthContext } from "../../context/AuthContext";

type SevEnum = "sev 5" | "sev 4" | "sev 3" | "sev 2" | "sev 1";

export type TicketFormValues = {
  application: string;
  severity: SevEnum;
  description: string;
  comments: string;
};

export const UserTicketForm = () => {
  const {
    register,
    reset,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<TicketFormValues>({});

  const { profile } = useAuthContext();

  const params = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [apps, setApps] = useState<AppType[] | null>(null);

  const onSubmit: SubmitHandler<TicketFormValues> = async (data) => {
    try {
      const { data: response, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          app_id: data.application,
          severity: data.severity,
          description: data.description,
        })
        .select();
      if (ticketError) throw ticketError;

      if (response && data.comments) {
        const { error: commentError } = await supabase
          .from("comments")
          .insert({ content: data.comments, ticket_id: response[0].id });

        if (commentError) throw commentError;
      }

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadApps = async () => {
      const { data, error } = await supabase
        .from("apps")
        .select(`id,name`)
        .order("name", { ascending: true });

      if (error) return;
      setApps(data);
    };

    loadApps();
  }, []);

  useEffect(() => {
    const checkMode = () => {
      if (params?.ticketId) setIsDisabled(true);
    };
    checkMode();
  }, [params.ticketId]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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

        <DisplayBox title="Created by">{profile?.name}</DisplayBox>

        <DisplayBox title="Status" placeHolderText="Open"></DisplayBox>

        <div className="flex flex-col gap-1">
          <SelectGroup
            error={errors.application ? errors.application.message : null}
            label="Application"
            id="application"
            {...register("application", {
              required: "Select an application",
              disabled: isDisabled,
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
            id="description"
            type="text"
            {...register("description", {
              required: "Update a brief description about the issue",
              disabled: isDisabled,
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

          if (result.description)
            setValue("description", result.description, {
              shouldValidate: true,
            });
          if (result.comments)
            setValue("comments", result.comments, { shouldValidate: true });
          if (result.severity)
            setValue("severity", result.severity, { shouldValidate: true });
        }}
      />
    </form>
  );
};
