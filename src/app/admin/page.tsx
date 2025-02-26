import Agenda from "@/views/calendar/page";
import Scrumboard from "@/views/scrumboard/page";


export default function app() {
  return (
    <div>
      <div className="flex flex-row">
        <div className="flex">
          <Agenda />
        </div>
        <div>
          <Scrumboard />
        </div>
      </div>
    </div>
  )
}



