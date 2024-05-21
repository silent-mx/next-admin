"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "./actions";

const inputWrapperClass = [
  "border-medium border-transparent bg-default-50/40 dark:bg-default-50/20",
  "group-data-[focus=true]:bg-default-50/40 data-[hover=true]:dark:bg-default-50/20",
  "group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20",
];

const schema = z.object({
  username: z
    .string({
      required_error: "请输入用户名或邮箱",
    })
    .min(1, "请输入用户名或邮箱"),
  password: z
    .string({
      required_error: "请输入密码",
    })
    .min(1, "请输入密码"),
});

export default function Page() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data);
    } catch (error: any) {
      setError("root", { message: error.message });
    }
  });
  return (
    <Card
      isBlurred
      shadow="sm"
      className="bg-background/60 dark:bg-default-100/50 w-full max-w-sm md:max-w-lg
      backdrop-blur-md backdrop-saturate-150 p-4"
    >
      <CardHeader className="text-xl">Next admin</CardHeader>
      <form onSubmit={onSubmit}>
        <CardBody className="flex flex-col gap-4">
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                label="用户名或邮箱"
                size="sm"
                variant="bordered"
                classNames={{ inputWrapper: inputWrapperClass }}
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
                label="密码"
                type="password"
                size="sm"
                variant="bordered"
                classNames={{ inputWrapper: inputWrapperClass }}
                errorMessage={error?.message}
                isInvalid={invalid}
              ></Input>
            )}
          ></Controller>
          {errors.root && <p className="text-red-500">{errors.root.message}</p>}
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isValid}
            className="bg-foreground/10 dark:bg-foreground/20"
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
