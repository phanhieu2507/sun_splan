import { PlanProgress } from "~/components/C3components";
import BHeader from "~/components/BHeader";
import Roadmap from "~/components/C3components/Roadmap";

export default function Index() {

    return (
        <div className="flex justify-center">
            <Roadmap userId={1}/>
        </div>
    )
}
