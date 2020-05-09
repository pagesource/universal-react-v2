# Application Directory Structure

## Default applications directory structure

Suitable for small scale applications:

- **app**
  - **components**
    - atoms
    - molecules
    - organisms
    - templates
  - **containers**
    - molecules
    - organisms
    - templates
  - **core**
  - **HOC**
  - pages

Our app structure follows `atomic` design principles. More can be read [here](http://bradfrost.com/blog/post/atomic-web-design/)

**app**

- **components**: All components will reside here in a structured manner. For further breakdown of component hierarchy please see [here](#react-component-library)

We follow atomic design of components and they are structured in this fashion.

- **Components**: All our components will reside here. The folder will be divided into Atoms, Molecules, Organisms and Templates.
  - **Atoms**:
    Atoms are the basic building blocks of matter applied to web interfaces, atoms are our HTML tags, such as a form label, an input or a button.
    Atoms can also include more abstract elements like color palettes, fonts and even more invisible aspects of an interface like animations. Atoms should be developed in such a way that they can be used in any projects
    e.g. Button, Input, Modal etc and it should be dumb component.
  - **Molecules**: Molecules are groups of atoms bonded together and are the smallest fundamental units of a compound. These molecules take on their own properties and serve as the backbone of our design systems.
    For example, a form label, input or button aren’t too useful by themselves, but combine them together as a form and now they can actually do something together.
    Building up to molecules from atoms encourages a “do one thing and do it well” mentality. While molecules can be complex, as a rule of thumb they are relatively simple combinations of atoms built for reuse.
    In code setup e.g. are Editor, Filtergrid, Flyout menu, navigation-bar etc.
  - **Organisms**: Molecules give us some building blocks to work with, and we can now combine them together to form organisms. Organisms are groups of molecules joined together to form a relatively complex, distinct section of an interface. In code setup e.g. Footer which have their own components PromotionText, NavigationBar, FlyoutMenu
  - **Templates**: At the template stage, we break our chemistry analogy to get into language that makes more sense to our clients and our final output. Templates consist mostly of groups of organisms stitched together to form pages. It’s here where we start to see the design coming together and start seeing things like layout in action.Templates are very concrete and provide context to all these relatively abstract molecules and organisms. Templates are also where clients start seeing the final design in place. In my experience working with this methodology, templates begin their life as HTML wire-frames, but over time increase fidelity to ultimately become the final deliverable. Bearded Studio in Pittsburgh follow a similar process, where designs start gray-scale and layout-less but slowly increase fidelity until the final design is in place.

## Business Context Driven Directory structure

In large and complex applications, for better maintainability it much more important to maintain independent business modules than reusability. If you wish to support a more application contextual directory structure than just atomic, you should consider configuring plop generator configurations at `./generators` accordingly.

An example of large applications directory structure looks like below:

- **app**
  - **shared**
    - atoms
    - molecules
    - organisms
    - templates
    - HOCs
  - **browse**
    - atoms
    - molecules
    - organisms
    - templates
  - **checkout**
    - atoms
    - molecules
    - organisms
    - templates
  - **profile**
    - atoms
    - molecules
    - organisms
    - templates
  - **core**
  - pages
