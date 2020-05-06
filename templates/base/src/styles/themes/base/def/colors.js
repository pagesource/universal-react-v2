// Region Colors
export default {
  CTA_PRIMARY: `
    background-color: var(--bg-cta-primary);
    color: var(--text-cta-primary);
    &:hover, &:active{
      background-color: var(--bg-cta-primary-active);
    }
  `,
  CTA_SECONDARY: `
    background-color: var(--bg-cta-secondary);
    color: var(--text-cta-secondary);
    &:hover, &:active{
      background-color: var(--bg-cta-secondary-active);
    }
  `,
  CTA_TERTIARY: `
    background-color: var(--bg-cta-tertiary);
    color: var(--text-cta-tertiary);
    &:hover, &:active{
      background-color: var(--bg-cta-tertiary-active);
      color: var(--text-inverse);
    }
  `,
  CTA_ICON: `
    background-color: var(--bg-cta-transparent);
    color: var(--black);
    &:hover, &:active{
      background-color: var(--bg-cta-transparent);
    }
  `,
  CTA_DISABLED: `
    &[disabled]{
      background-color: var(--brand-disabled);
      color: var(--text-cta-disabled);
    }
  `,
  CTA_TRANSPARENT: `
    background-color: transparent;
    color: var(--text-cta-tertiary);
    &:hover, &:active{
      background-color: transparent;
      color: var(--text-cta-active);
    }
  `,
  CTA_DEFAULT: `
    background-color:var(--bg-cta-default);
    color:var(--text-cta-default);
  `,
  CTA_INFO: `
    background-color:var(--bg-cta-info);
    color:var(--text-cta-info);
  `,
  CTA_WARNING: `
    background-color:var(--bg-cta-warning);
    color:var(--text-cta-warning);`,
  CTA_SUCCESS: `
    background-color:var(--bg-cta-success);
    color:var(--text-cta-success);`,
  CTA_ERROR: `
    background-color:var(--bg-cta-error);
    color:var(--text-cta-error);`,
  CTA_TAB: `
    background-color: var(--bg-cta-tertiary);
    color: var(--text-cta-tertiary);
  `,
  TOGGLE_SWITCH: `
    background-color: var(--bg-cta-secondary);
  `,
  TOGGLE_SWITCH_INACTIVE: `
    background-color: var(--grey);
  `,
  LINK_PRIMARY: `
    color: var(--text-link);
  `,
  TEXT_DEFAULT: `
    color: var(--text-primary);
  `,
  TEXT_INVERSE: `
    color: var(--text-inverse);
  `,
  TEXT_SECONDARY: `
    color: var(--text-secondary);
  `,
  TEXT_LIGHT: `
    color: var(--text-light);
  `,
  HERO_CONTENT: `
    color: var(--text-inverse);
    background-color: var(--black);
  `,
  TEXT_ERROR: `
    color: var(--error);
  `,
  FIELD_DEFAULT: `
    color: var(--text-cta-tertiary);
    background-color: var(--bg-cta-tertiary);
  `,
  FIELD_DISABLED: `
    background-color: var(--brand-disabled);
    color: 1px solid var(--text-cta-disabled);
  `,
  LIST_ITEM: `
    background-color: var(--white);
    &:hover, &:active, &.active{
      background-color: var(--text-light);
    }
  `,
  TAG_BACKGROUND: `
    background-color: var(--bg-primary);
  `
};
