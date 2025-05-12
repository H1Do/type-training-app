export const getVerifyEmailHtml = (
    link: string,
    t: (key: string) => string,
) => `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 2rem; text-align: center; color: #333;">
    <h2 style="color: #4CAF50;">${t('mail.verify_title')}</h2>
    <p style="font-size: 1rem;">${t('mail.verify_instruction')}</p>
    <a href="${link}" style="
      display: inline-block;
      background-color: #4CAF50;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 1rem;
      font-weight: bold;
    ">${t('mail.verify_button')}</a>
    <p style="font-size: 0.875rem; color: #888; margin-top: 2rem;">
      ${t('mail.ignore_if_not_you')}
    </p>
  </div>
`;

export const getResetPasswordHtml = (
    link: string,
    t: (key: string) => string,
) => `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 2rem; text-align: center; color: #333;">
    <h2 style="color: #f57c00;">${t('mail.reset_title')}</h2>
    <p style="font-size: 1rem;">${t('mail.reset_instruction')}</p>
    <a href="${link}" style="
      display: inline-block;
      background-color: #f57c00;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 1rem;
      font-weight: bold;
    ">${t('mail.reset_button')}</a>
    <p style="font-size: 0.875rem; color: #888; margin-top: 2rem;">
      ${t('mail.ignore_if_not_you')}
    </p>
  </div>
`;
