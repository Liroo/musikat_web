import common from "./common.json";
import home from "./features/home.json";
import intervalFindr from "./features/intervalFindr.json";
import noteGuessr from "./features/noteGuessr.json";
import interval from "./interval.json";
import note from "./note.json";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  common,
  note,
  interval,
  features: {
    noteGuessr,
    intervalFindr,
    home,
  },
};
