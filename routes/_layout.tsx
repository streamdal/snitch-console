import {LayoutContext} from "$fresh/server.ts";
import ServiceMapComponent from "../islands/serviceMap.tsx";
import {NavBar} from "../components/nav/nav.tsx";
import {ReactFlowProvider} from "reactflow";
import OpModal from "../islands/opModal.tsx";
import {
  serviceSignal,
  setServiceSignal,
} from "../components/serviceMap/serviceSignal.ts";
import { getAll } from "../lib/fetch.ts";
import { version } from "../version.ts";
import { Toast, toastSignal } from "../components/toasts/toast.tsx";

export default async function Layout(req: Request, ctx: LayoutContext) {
  const allServices = await getAll();
  setServiceSignal(allServices);

  if (ctx.data?.success?.message) {
    toastSignal.value = {
      id: "notifications",
      type: ctx.data?.success?.status ? "success" : "error",
      message: ctx.data?.success?.message,
    };
  }
  return (
    <>
      <NavBar />
      <OpModal
        serviceMap={serviceSignal.value}
      />
      <Toast id="notifications" />
      <div className="flex flex-col w-screen text-web">
        <ReactFlowProvider>
          <ctx.Component />
          <ServiceMapComponent
            initNodes={Array.from(serviceSignal.value.nodesMap.values())}
            initEdges={Array.from(serviceSignal.value.edgesMap.values())}
            blur={req.url.includes("pipelines") |
              req.url.includes("notifications")}
          />
        </ReactFlowProvider>
        <div class="absolute bottom-0 left-0 text-streamdalPurple ml-2 mb-1">
          {version}
        </div>
      </div>
    </>
  );
}
