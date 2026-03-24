import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import {
  Button,
  DisplayBox,
  Input,
  TextArea,
  SelectGroup,
} from "../components/ReusableElements";
import { supabase } from "../../supabase/supabaseClient";

type Mode = "insert" | "update";
type App = { id: string; name: string };

export const UserTicketForm = () => {
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const selectAppRef = useRef(null);
  const selectSevRef = useRef(null);
  const params = useParams();
  const [mode, setMode] = useState<Mode>("insert");
  const [apps, setApps] = useState<App[] | null>(null);

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
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submit");
      }}
      noValidate
      className="px-24 py-20 flex flex-col"
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

        <SelectGroup
          disabled={mode === "update"}
          ref={selectAppRef}
          label="Application"
          id="application"
          name="application"
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

        <SelectGroup
          ref={selectSevRef}
          label="Severity"
          name="severity"
          id="severity"
        >
          <option value="">Select Severity</option>
          <option value="sev5">Sev 5</option>
          <option value="sev4">Sev 4</option>
          <option value="sev3">Sev 3</option>
          <option value="sev2">Sev 2</option>
          <option value="sev1">Sev 1</option>
        </SelectGroup>

        <div className="col-span-2">
          <Input
            ref={inputRef}
            label="Description"
            disabled={mode === "update"}
            id="description"
            name="description"
            type="text"
          />
        </div>
        <DisplayBox title="Assigned to" placeHolderText="NA"></DisplayBox>

        <div className="col-span-3 grid grid-cols-2 gap-12">
          <TextArea
            ref={textareaRef}
            label="Comments"
            id="comments"
            name="comments"
          ></TextArea>
          <div className="flex flex-col gap-2">
            <span className="font-bold">Previous Updates</span>
            <div className="input h-32 overflow-y-auto"></div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="min-w-60 py-3 text-xl mt-18 place-self-center"
      >
        Submit
      </Button>
    </form>
  );
};
