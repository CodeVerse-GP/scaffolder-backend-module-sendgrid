import { sendEmailAction } from './sendgrid';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail');

describe('sendEmailAction', () => {
  const mockConfig = {
    getOptionalString: jest.fn(),
  };

  const action = sendEmailAction({ config: mockConfig as any });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    mockConfig.getOptionalString.mockReturnValue('mock-sendgrid-api-key');
    const mockSend = jest.fn();
    (sgMail.setApiKey as jest.Mock).mockImplementation(() => {});
    (sgMail.send as jest.Mock).mockImplementation(mockSend);

    await expect(
      action.handler(
        createMockActionContext({
          input: {
            to: 'recipient@example.com',
            from: 'sender@example.com',
            subject: 'Test Email',
            body: '<p>This is a test email</p>',
          },
        }),
      ),
    ).resolves.toBeUndefined();

    expect(mockConfig.getOptionalString).toHaveBeenCalledWith('sendgrid.apiKey');
    expect(sgMail.setApiKey).toHaveBeenCalledWith('mock-sendgrid-api-key');
    expect(mockSend).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    });
  });

  it('should throw an error if SendGrid API key is not configured', async () => {
    mockConfig.getOptionalString.mockReturnValue(undefined);

    await expect(
      action.handler(
        createMockActionContext({
          input: {
            to: 'recipient@example.com',
            from: 'sender@example.com',
            subject: 'Test Email',
            body: '<p>This is a test email</p>',
          },
        }),
      ),
    ).rejects.toThrow('SendGrid API key is not configured');

    expect(mockConfig.getOptionalString).toHaveBeenCalledWith('sendgrid.apiKey');
    expect(sgMail.setApiKey).not.toHaveBeenCalled();
    expect(sgMail.send).not.toHaveBeenCalled();
  });

  it('should throw an error if email sending fails', async () => {
    mockConfig.getOptionalString.mockReturnValue('mock-sendgrid-api-key');
    (sgMail.setApiKey as jest.Mock).mockImplementation(() => {});
    (sgMail.send as jest.Mock).mockRejectedValue(new Error('SendGrid error'));

    await expect(
      action.handler(
        createMockActionContext({
          input: {
            to: 'recipient@example.com',
            from: 'sender@example.com',
            subject: 'Test Email',
            body: '<p>This is a test email</p>',
          },
        }),
      ),
    ).rejects.toThrow('SendGrid email send failed: SendGrid error');

    expect(mockConfig.getOptionalString).toHaveBeenCalledWith('sendgrid.apiKey');
    expect(sgMail.setApiKey).toHaveBeenCalledWith('mock-sendgrid-api-key');
    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    });
  });
});
