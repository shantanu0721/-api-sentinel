import smtplib
from email.mime.text import MIMEText


def send_email(to_email, subject, body):

    sender_email = "shaantiwari03@gmail.com"
    sender_password = "rvckpftvpxrkxngw"

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    server = smtplib.SMTP("smtp.gmail.com", 587)

    server.starttls()

    server.login(sender_email, sender_password)

    server.sendmail(
        sender_email,
        to_email,
        msg.as_string()
    )

    server.quit()