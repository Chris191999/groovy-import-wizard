import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema, SignupData } from '@/lib/schemas/auth';

interface SignupFormProps {
  onSignup: (data: SignupData) => Promise<boolean>;
  loading: boolean;
}

export const SignupForm = ({ onSignup, loading }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      pricingPlan: undefined,
      auraCode: "",
    },
  });
  
  const handleFormSubmit = async (data: SignupData) => {
    const success = await onSignup(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <div className="space-y-6">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricingPlan"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <select
                    {...field}
                    value={field.value ?? ""}
                    className="w-full rounded-md border border-gray-300 bg-black text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select Pricing Plan</option>
                    <option value="Let him cook (free)">Let him cook (free)</option>
                    <option value="Cooked">Cooked</option>
                    <option value="Goated">Goated</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auraCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Aura Code (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</Button>
        </form>
      </Form>
    </div>
  );
};
