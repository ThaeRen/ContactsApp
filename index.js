import { Navigation } from "react-native-navigation";

import ContactsList from "./src/ContactsList";
import ContactView from "./src/ContactView";
import AddContact from "./src/AddContact";

Navigation.registerComponent(`ContactsList`, () => ContactsList);
Navigation.registerComponent(`ContactView`, () => ContactView);
Navigation.registerComponent(`AddContact`, () => AddContact);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: "ContactsList"
          }
        }]
      }
    }
  });
});