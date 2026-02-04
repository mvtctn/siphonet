import nodemailer from 'nodemailer'
import { supabase } from './supabase'

export async function getEmailConfig() {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'email_config')
        .single()

    if (error || !data) {
        return null
    }

    return data.value
}

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html?: string, text?: string }) {
    const config = await getEmailConfig()

    if (!config || !config.host || !config.user || !config.pass) {
        console.warn('Email config missing or incomplete. Email not sent.')
        return false
    }

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port || 587,
        secure: config.port === 465,
        auth: {
            user: config.user,
            pass: config.pass,
        },
    })

    try {
        await transporter.sendMail({
            from: `"${config.from_name || 'Siphonet'}" <${config.user}>`,
            to,
            subject,
            text,
            html,
        })
        return true
    } catch (error) {
        console.error('Failed to send email:', error)
        return false
    }
}
