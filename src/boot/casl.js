import { boot } from "quasar/wrappers";
import { abilitiesPlugin } from "@casl/vue";
import { Ability, AbilityBuilder } from "@casl/ability";

export function defineAbilityForGuest() {
  const { can, rules } = new AbilityBuilder();
  can("read", "auth.login");
  return rules;
}

export function defineAbilityForUser(user) {
  const { can, rules } = new AbilityBuilder(defineAbilityForGuest());
  can("read", "admin.home.index");
  if (user.Type == "SUPER_ADMIN") {
    can("manage", "all");
  } else {
    for (let permission of user.Privilege) {
      can("read", permission);
    }
  }
  return rules;
}

const ability = new Ability(defineAbilityForGuest());

export default boot(({ app }) => {
  app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true,
  });
});

export { ability };
