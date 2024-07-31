/** @format */

export const useLib = () => {
  const getBase64 = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const getPublicUrl = async (bucket: any, filePath: any) => {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    if (error) throw error;
    console.log(data.publicUrl);
    return data.publicUrl;
  };
  const deleteFileInBucket = async (bucket: any, filePath: any) => {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    if (error) throw error;
    console.log(data);
    return data;
  };
  const removeAllSpaces = (str: string) => {
    return str.replace(/\s/g, "");
  };
  return {
    getBase64,
    getPublicUrl,
    deleteFileInBucket,
    removeAllSpaces,
  };
};
