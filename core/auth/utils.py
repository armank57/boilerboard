from django.core.mail import EmailMessage
import os

class Util:
  @staticmethod
  def send_email(data):
    # print(os.environ.get('EMAIL_FROM'))
    email = EmailMessage(
      subject=data['subject'],
      body=data['body'],
      from_email="arun02.sc@gmail.com",
      to=[data['to_email']]
    )

    email.send()
    print('Email Sent!')