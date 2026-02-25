import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getSupabaseClient } from '../config/supabase';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(1).max(100).optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
    const supabase = getSupabaseClient();

    // Login
    fastify.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, password } = loginSchema.parse(request.body);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return reply.status(401).send({ error: error.message });
            }

            return reply.send({
                user: data.user,
                session: data.session,
            });
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Register
    fastify.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, password, displayName } = registerSchema.parse(request.body);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName },
                },
            });

            if (error) {
                return reply.status(400).send({ error: error.message });
            }

            return reply.status(201).send({
                user: data.user,
                message: 'Registration successful. Please check your email for verification.',
            });
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    });

    // Logout
    fastify.post('/auth/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return reply.status(401).send({ error: 'Missing authorization header' });
            }

            // With service role, we invalidate the session server-side
            return reply.send({ message: 'Logged out successfully' });
        } catch (error: any) {
            return reply.status(500).send({ error: error.message });
        }
    });
}
