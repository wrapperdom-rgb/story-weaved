import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePremiumAccess = () => {
  const { user } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasPremium(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'succeeded')
        .limit(1);

      if (!error && data && data.length > 0) {
        setHasPremium(true);
      } else {
        setHasPremium(false);
      }
      setLoading(false);
    };

    checkAccess();
  }, [user]);

  return { hasPremium, loading };
};
