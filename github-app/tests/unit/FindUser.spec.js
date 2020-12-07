import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import FindUser from "@/components/FindUser.vue";

describe("FindUser.vue", () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue(); // because of vuetify, we should use a localVue instance
    vuetify = new Vuetify();
    wrapper = shallowMount(FindUser, {
      localVue,
      vuetify,
      attachTo: document.body
    });
  });

  it("should render the search, sort, order, and the reset button", () => {
    // to make sure we are free from vuetify components in our tests, use data-testid attributes to search for elements
    expect(wrapper.find('[data-testid="search-field"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sort-field"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="order-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="reset-btn"]').exists()).toBe(true);
  });
});
