import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";

export default function Page() {
  const inputWrapperClass = [
    "border-medium border-transparent bg-default-50/40 dark:bg-default-50/20",
    "group-data-[focus=true]:bg-default-50/40 data-[hover=true]:dark:bg-default-50/20",
    "group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20",
  ];

  return (
    <Card
      isBlurred
      shadow="sm"
      className="bg-background/60 dark:bg-default-100/50 w-full max-w-sm
      backdrop-blur-md backdrop-saturate-150 p-4"
    >
      <CardHeader className="text-xl">Next Admin</CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input
          isRequired
          label="用户名或邮箱"
          size="sm"
          variant="bordered"
          classNames={{
            inputWrapper: inputWrapperClass,
          }}
        ></Input>
        <Input
          isRequired
          label="密码"
          size="sm"
          type="password"
          variant="bordered"
          classNames={{ inputWrapper: inputWrapperClass }}
        ></Input>
        <Button isLoading className="bg-foreground/10 dark:bg-foreground/20">
          登 录
        </Button>
      </CardBody>
      <CardFooter>
        <Divider orientation="horizontal" className="flex-auto"></Divider>
        {/* <span className="shrink-0 text-tiny text-default-500">其他方式</span> */}
        <Divider orientation="horizontal" className="flex-auto"></Divider>
      </CardFooter>
      <CardFooter className="flex justify-center mt-4">
        <p className="shrink-0 text-tiny text-default-500">
          版权所有 © 2024-{new Date().getFullYear()} 中国电信股份有限公司昭通分公司
        </p>
      </CardFooter>
    </Card>
  );
}
