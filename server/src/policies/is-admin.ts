export default (policyContext, config, { strapi }) => {
  if (
    policyContext.state.user.roles.some(
      (role) => role.code === 'strapi-super-admin' || role.name === 'Super Admin'
    )
  ) {
    return true;
  }

  return false;
};
