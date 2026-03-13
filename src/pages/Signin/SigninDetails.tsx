export const SigninDetails = () => (
  <div className="flex gap-8 text-sm">
    <div className="border border-neutral-500 p-2 rounded bg-neutral-100">
      <p className="bg-neutral-900 text-neutral-50 text-center rounded p-1 mb-2">
        User Account
      </p>
      <div className="bg-white rounded p-2">
        <p>
          <b>Email:</b> user1@resolve.com
        </p>
        <p>
          <b>Password:</b> resolve@user
        </p>
      </div>
    </div>
    <div className="border border-neutral-500 p-2 rounded bg-neutral-100">
      <p className="bg-neutral-900 text-neutral-50 rounded p-1 mb-2 text-center">
        Agent Account
      </p>
      <div className="bg-white rounded p-2">
        <p>
          <b>Email:</b> agent1@resolve.com
        </p>
        <p>
          <b>Password:</b> resolve@agent
        </p>
      </div>
    </div>
  </div>
);
