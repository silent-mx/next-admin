"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { authenticate } from "./actions";

const inputWrapperClass = cn(
  "border-medium border-transparent bg-default-50/40 dark:bg-default-50/20",
  "group-data-[focus=true]:bg-default-50/40 data-[hover=true]:dark:bg-default-50/20",
  "group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20"
);

const formSchema = z.object({
  username: z.string().min(1, { message: "用户名或邮箱不能为空" }),
  password: z.string().min(1, { message: "密码不能为空" }),
});

export default function Page() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await authenticate(data);
    } catch (error: any) {
      setError("root", { message: error.message });
    }
  });

  return (
    <Card
      isBlurred
      shadow="md"
      className={cn(
        "dark:bg-default-100/50",
        "w-full max-w-sm md:max-w-lg",
        "backdrop-blur-md backdrop-saturate-150 p-3"
      )}
    >
      <CardHeader className="text-xl">Next Admin</CardHeader>
      <form onSubmit={onSubmit}>
        <CardBody className="space-y-4">
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                label="用户名或邮箱*"
                variant="bordered"
                size="sm"
                classNames={{
                  inputWrapper: inputWrapperClass,
                }}
                errorMessage={error?.message}
                isInvalid={invalid}
              ></Input>
            )}
          ></Controller>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                label="密码*"
                type="password"
                size="sm"
                variant="bordered"
                classNames={{ inputWrapper: inputWrapperClass }}
                errorMessage={error?.message}
                isInvalid={invalid}
              ></Input>
            )}
          ></Controller>
          {errors.root && <p className="text-danger">{errors.root.message}</p>}
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isValid}
            className="dark:bg-foreground/20"
          >
            登 录
          </Button>
        </CardBody>
      </form>
      <CardFooter>
        <Divider orientation="horizontal" className="flex-auto"></Divider>
        <span className="shrink-0 text-tiny text-default-500 px-4">其他方式</span>
        <Divider orientation="horizontal" className="flex-auto"></Divider>
      </CardFooter>
    </Card>
  );
}
